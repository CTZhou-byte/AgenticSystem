#!/usr/bin/env node
const esbuild = require('esbuild');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Simple HTTP(S) loader plugin to allow http/https imports
const httpLoaderPlugin = {
  name: 'http-loader',
  setup(build) {
    build.onResolve({ filter: /^(https?:)\/\// }, args => ({
      path: args.path,
      namespace: 'http-url',
    }));

    // Resolve relative imports within fetched http modules
    build.onResolve({ filter: /.*/, namespace: 'http-url' }, args => {
      try {
        const importerUrl = new URL(args.importer.replace(/^http-url:/, ''));
        const resolved = new URL(args.path, importerUrl);
        return { path: resolved.toString(), namespace: 'http-url' };
      } catch {
        // Fallback: if already absolute
        try {
          const url = new URL(args.path);
          return { path: url.toString(), namespace: 'http-url' };
        } catch {
          return { path: args.path, namespace: 'http-url' };
        }
      }
    });

    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async (args) => {
      const url = new URL(args.path);
      const client = url.protocol === 'https:' ? https : http;
      const contents = await new Promise((resolve, reject) => {
        client.get(url, res => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirected = new URL(res.headers.location, url);
            client.get(redirected, res2 => {
              collect(res2, resolve, reject);
            }).on('error', reject);
          } else {
            collect(res, resolve, reject);
          }
        }).on('error', reject);
      });
      // Infer loader based on extension
      let loader = 'js';
      if (url.pathname.endsWith('.ts')) loader = 'ts';
      else if (url.pathname.endsWith('.tsx')) loader = 'tsx';
      else if (url.pathname.endsWith('.json')) loader = 'json';
      else if (url.pathname.endsWith('.css')) loader = 'css';
      return { contents, loader };
    });
  }
};

function collect(stream, resolve, reject) {
  const chunks = [];
  stream.on('data', (c) => chunks.push(c));
  stream.on('end', () => resolve(Buffer.concat(chunks)));
  stream.on('error', reject);
}

async function buildBundle() {
  const outFile = path.join(__dirname, '..', 'static', 'js', 'webadb-bundle.js');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });

  const entrySource = `
    import { AdbDaemonWebUsbDeviceManager } from 'https://esm.sh/@yume-chan/adb-daemon-webusb@2.1.0';
    import { AdbDaemonTransport } from 'https://esm.sh/@yume-chan/adb@2.3.1';
    import AdbWebCredentialStore from 'https://esm.sh/@yume-chan/adb-credential-web@2.1.0';

    async function connectAdb() {
      const manager = new AdbDaemonWebUsbDeviceManager();
      const device = await manager.requestDevice();
      const connection = await device.connect();
      const transport = await AdbDaemonTransport.authenticate({
        serial: device.serial,
        connection,
        credentialStore: new AdbWebCredentialStore('LocalADB'),
      });
      return {
        // 基本能力
        shell: async (cmd) => {
          const stream = await transport.adb.createShell();
          const writer = stream.writable.getWriter();
          const encoder = new TextEncoder();
          await writer.write(encoder.encode(cmd + String.fromCharCode(10)));
          await writer.close();
          const decoder = new TextDecoder();
          const reader = stream.readable.getReader();
          let output = '';
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            output += decoder.decode(value);
          }
          return output;
        },
        close: async () => {
          await transport.connection.close();
        },
        // 展示信息
        serial: transport.serial,
        name: device.name,
        banner: transport.banner,
      };
    }

    window.WebADB = { connectAdb };
  `;

  await esbuild.build({
    stdin: {
      contents: entrySource,
      resolveDir: process.cwd(),
      sourcefile: 'entry.js',
    },
    bundle: true,
    format: 'iife',
    globalName: 'WebADB',
    sourcemap: false,
    outfile: outFile,
    plugins: [httpLoaderPlugin],
    target: ['es2020'],
  });
  console.log('Bundle written to', outFile);
}

buildBundle().catch((e) => {
  console.error(e);
  process.exit(1);
});