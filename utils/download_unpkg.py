#!/usr/bin/env python3
import os
import re
import json
import urllib.request
import urllib.error
from typing import List, Dict, Tuple, Set, Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DEST_ROOT = os.path.join(PROJECT_ROOT, 'static', 'vendor')

PACKAGES: List[Tuple[str, str]] = [
    ('@yume-chan/adb', '2.3.1'),
    ('@yume-chan/adb-daemon-webusb', '2.1.0'),
    ('@yume-chan/adb-credential-web', '2.1.0'),
    ('@yume-chan/stream-extra', '2.1.0'),
    ('@yume-chan/struct', '2.0.1'),
    ('@yume-chan/event', '2.0.0'),
    ('@yume-chan/async', '4.1.3'),
    ('@yume-chan/no-data-view', '2.0.0'),
    ('@yume-chan/scrcpy', '2.1.0'),
    ('@yume-chan/scrcpy-decoder-webcodecs', '2.1.0'),
    ('@yume-chan/adb-scrcpy', '2.3.0'),
]

IMPORT_REGEX = re.compile(r"(?:import|export)\s*(?:[^'\";]+\s*from\s*)?['\"](\./[^'\"]+)['\"]")
DYNAMIC_IMPORT_REGEX = re.compile(r"import\(['\"](\./[^'\"]+)['\"]\)")


def fetch_url(url: str) -> Optional[bytes]:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        print(f'HTTPError fetching {url}: {e}')
        return None
    except urllib.error.URLError as e:
        print(f'URLError fetching {url}: {e}')
        return None


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def parse_relative_imports(source_text: str) -> List[str]:
    rels = set()
    for m in IMPORT_REGEX.finditer(source_text):
        rels.add(m.group(1))
    for m in DYNAMIC_IMPORT_REGEX.finditer(source_text):
        rels.add(m.group(1))
    return sorted(rels)


def store_file(dest_root: str, pkg: str, version: str, store_dir: str, rel_path: str, content: bytes, src_url: str):
    dest_base = os.path.join(dest_root, f'{pkg}@{version}', store_dir)
    ensure_dir(dest_base)
    dest_path = os.path.join(dest_base, rel_path)
    ensure_dir(os.path.dirname(dest_path))
    with open(dest_path, 'wb') as f:
        f.write(content)
    print(f'Downloaded: {src_url} -> {dest_path}')


def resolve_entry_path(base_url: str) -> Optional[str]:
    # 从 package.json 解析 ESM 入口
    pkg_json = fetch_url(base_url + '/package.json')
    if not pkg_json:
        return None
    try:
        data = json.loads(pkg_json.decode('utf-8'))
    except Exception:
        return None

    exports = data.get('exports')
    module = data.get('module')

    def norm(p: str) -> str:
        # 规范化为以 / 开头的路径
        p = p.strip()
        if p.startswith('./'):
            p = p[1:]  # 变为 /xxx
        if not p.startswith('/'):
            p = '/' + p
        return p

    entry: Optional[str] = None
    if isinstance(exports, str):
        entry = exports
    elif isinstance(exports, dict):
        main = exports.get('.') or exports
        if isinstance(main, str):
            entry = main
        elif isinstance(main, dict):
            entry = main.get('import') or main.get('default') or main.get('module')
    if not entry and isinstance(module, str):
        entry = module
    if not entry:
        return None
    return norm(entry)


def download_recursive(base_url: str, pkg: str, version: str, entry_path: str) -> bool:
    # 根据入口路径递归下载并保存在相同目录结构下
    # entry_path 形如 /esm/index.js 或 /dist/esm/index.js
    entry_dir = os.path.dirname(entry_path).lstrip('/')  # esm 或 dist/esm
    store_dir = entry_dir

    visited: Set[str] = set()
    queue: List[str] = []

    # 下载入口
    entry_url = base_url + entry_path
    entry_content = fetch_url(entry_url)
    if not entry_content:
        print(f'Warning: cannot fetch entry {entry_url}')
        return False
    store_file(DEST_ROOT, pkg, version, store_dir, 'index.js', entry_content, entry_url)
    visited.add('index.js')
    queue.append('index.js')

    while queue:
        current = queue.pop(0)
        current_url = base_url + '/' + entry_dir + '/' + current
        content = fetch_url(current_url)
        if not content:
            continue
        text = content.decode('utf-8', errors='ignore')
        rel_imports = parse_relative_imports(text)
        for spec in rel_imports:
            rel = spec if spec.endswith('.js') else (spec + '.js')
            if rel.startswith('./'):
                rel = rel[2:]
            if rel in visited:
                continue
            dep_url = base_url + '/' + entry_dir + '/' + rel
            dep_content = fetch_url(dep_url)
            if not dep_content:
                # 目录导入尝试 index.js
                base_no_ext = rel[:-3] if rel.endswith('.js') else rel
                alt_rel = base_no_ext + '/index.js'
                dep_url = base_url + '/' + entry_dir + '/' + alt_rel
                dep_content = fetch_url(dep_url)
                if not dep_content:
                    continue
                rel = alt_rel
            store_file(DEST_ROOT, pkg, version, store_dir, rel, dep_content, dep_url)
            visited.add(rel)
            queue.append(rel)

    return True


def download_package(pkg: str, version: str):
    base_url = f'https://unpkg.com/{pkg}@{version}'

    # 优先：尝试解析 package.json 的入口
    entry = resolve_entry_path(base_url)
    if entry and download_recursive(base_url, pkg, version, entry):
        return

    # 备选：常见目录入口尝试
    for candidate in ['/package/esm/index.js', '/esm/index.js']:
        if download_recursive(base_url, pkg, version, candidate):
            return

    print(f'Warning: no ESM files found for {pkg}@{version} at known locations')


if __name__ == '__main__':
    ensure_dir(DEST_ROOT)
    for pkg, ver in PACKAGES:
        download_package(pkg, ver)
    print('Done downloading to', DEST_ROOT)