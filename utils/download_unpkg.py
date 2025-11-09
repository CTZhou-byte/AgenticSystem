#!/usr/bin/env python3
import os
import sys
import json
import urllib.request
import urllib.error
from typing import List, Dict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DEST_ROOT = os.path.join(PROJECT_ROOT, 'static', 'vendor')

PACKAGES = [
    ('@yume-chan/adb', '2.3.1'),
    ('@yume-chan/adb-daemon-webusb', '2.1.0'),
    ('@yume-chan/adb-credential-web', '2.1.0'),
    ('@yume-chan/stream-extra', '2.3.1'),
    ('@yume-chan/struct', '2.3.1'),
    ('@yume-chan/abort-controller-extra', '2.3.1'),
]

META_SUFFIX = '/esm/?meta'
DOWNLOAD_PREFIX = '/esm/'


def fetch_url(url: str) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        return resp.read()


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def download_package(pkg: str, version: str):
    base_url = f'https://unpkg.com/{pkg}@{version}'
    meta_url = base_url + META_SUFFIX
    print(f'Fetching meta: {meta_url}')
    try:
        meta_data = fetch_url(meta_url)
    except urllib.error.HTTPError as e:
        print(f'Error fetching meta for {pkg}@{version}: {e}')
        return
    meta = json.loads(meta_data.decode('utf-8'))

    dest_base = os.path.join(DEST_ROOT, f'{pkg}@{version}', 'esm')
    ensure_dir(dest_base)

    def walk_files(node: Dict, current_path: str):
        # node has keys: path, type, files (if dir)
        if node.get('type') == 'file':
            rel = node['path']
            # unpkg meta returns path starting with /esm/...
            if rel.startswith('/esm/'):
                rel_path = rel[len('/esm/'):]  # strip prefix
            else:
                rel_path = rel
            dest_path = os.path.join(dest_base, rel_path)
            ensure_dir(os.path.dirname(dest_path))
            file_url = base_url + '/' + rel.lstrip('/')
            try:
                content = fetch_url(file_url)
            except urllib.error.HTTPError as e:
                print(f'Error downloading {file_url}: {e}')
                return
            with open(dest_path, 'wb') as f:
                f.write(content)
            print(f'Downloaded: {file_url} -> {dest_path}')
        elif node.get('type') == 'directory':
            for child in node.get('files', []):
                walk_files(child, current_path)

    # The root meta contains a list of files under esm
    files = meta.get('files', [])
    for item in files:
        walk_files(item, '')


if __name__ == '__main__':
    ensure_dir(DEST_ROOT)
    for pkg, ver in PACKAGES:
        download_package(pkg, ver)
    print('Done downloading to', DEST_ROOT)