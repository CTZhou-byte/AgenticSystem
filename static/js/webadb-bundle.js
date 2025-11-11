var WebADB = (() => {
  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

  // http-url:https://esm.sh/@yume-chan/async@4.1.3/es2022/async.mjs
  var _t, _r, _s, _e, _a;
  var o = (_a = class {
    constructor() {
      __privateAdd(this, _t);
      __privateAdd(this, _r);
      __privateAdd(this, _s);
      __privateAdd(this, _e, "running");
      __publicField(this, "resolve", (e) => {
        __privateGet(this, _r).call(this, e), __privateSet(this, _e, "resolved");
      });
      __publicField(this, "reject", (e) => {
        __privateGet(this, _s).call(this, e), __privateSet(this, _e, "rejected");
      });
      __privateSet(this, _t, new Promise((e, t2) => {
        __privateSet(this, _r, e), __privateSet(this, _s, t2);
      }));
    }
    get promise() {
      return __privateGet(this, _t);
    }
    get state() {
      return __privateGet(this, _e);
    }
  }, _t = new WeakMap(), _r = new WeakMap(), _s = new WeakMap(), _e = new WeakMap(), _a);
  var n = class {
    constructor(e = 0) {
      __publicField(this, "nextId");
      __publicField(this, "pendingResolvers", /* @__PURE__ */ new Map());
      this.nextId = e;
    }
    add() {
      let e = this.nextId++, t2 = new o();
      return this.pendingResolvers.set(e, t2), [e, t2.promise];
    }
    getResolver(e) {
      if (!this.pendingResolvers.has(e)) return null;
      let t2 = this.pendingResolvers.get(e);
      return this.pendingResolvers.delete(e), t2;
    }
    resolve(e, t2) {
      let s = this.getResolver(e);
      return s !== null ? (s.resolve(t2), true) : false;
    }
    reject(e, t2) {
      let s = this.getResolver(e);
      return s !== null ? (s.reject(t2), true) : false;
    }
  };
  function h(r) {
    return new Promise((e) => {
      globalThis.setTimeout(() => e(), r);
    });
  }
  function p(r) {
    return typeof r == "object" && r !== null && "then" in r;
  }

  // http-url:https://esm.sh/@yume-chan/no-data-view@2.0.0/es2022/no-data-view.mjs
  function t(n2, i5, x5) {
    return x5 ? (n2[i5] | n2[i5 + 1] << 8) << 16 >> 16 : (n2[i5] << 8 | n2[i5 + 1]) << 16 >> 16;
  }
  function p2(n2, i5, x5, g2) {
    g2 ? (n2[i5] = x5, n2[i5 + 1] = x5 >> 8) : (n2[i5] = x5 >> 8, n2[i5 + 1] = x5);
  }
  function U(n2, i5, x5) {
    return x5 ? n2[i5] | n2[i5 + 1] << 8 | n2[i5 + 2] << 16 | n2[i5 + 3] << 24 : n2[i5] << 24 | n2[i5 + 1] << 16 | n2[i5 + 2] << 8 | n2[i5 + 3];
  }
  function j(n2, i5, x5, g2) {
    g2 ? (n2[i5] = x5, n2[i5 + 1] = x5 >> 8, n2[i5 + 2] = x5 >> 16, n2[i5 + 3] = x5 >> 24) : (n2[i5] = x5 >> 24, n2[i5 + 1] = x5 >> 16, n2[i5 + 2] = x5 >> 8, n2[i5 + 3] = x5);
  }
  function y(n2, i5, x5) {
    return x5 ? BigInt(n2[i5]) | BigInt(n2[i5 + 1]) << 8n | BigInt(n2[i5 + 2]) << 16n | BigInt(n2[i5 + 3]) << 24n | BigInt(n2[i5 + 4]) << 32n | BigInt(n2[i5 + 5]) << 40n | BigInt(n2[i5 + 6]) << 48n | BigInt(n2[i5 + 7] << 24) << 32n : BigInt(n2[i5] << 24) << 32n | BigInt(n2[i5 + 1]) << 48n | BigInt(n2[i5 + 2]) << 40n | BigInt(n2[i5 + 3]) << 32n | BigInt(n2[i5 + 4]) << 24n | BigInt(n2[i5 + 5]) << 16n | BigInt(n2[i5 + 6]) << 8n | BigInt(n2[i5 + 7]);
  }
  function z(n2, i5, x5) {
    n2[i5] = Number(x5 & 0xffn), n2[i5 + 1] = Number(x5 >> 8n & 0xffn), n2[i5 + 2] = Number(x5 >> 16n & 0xffn), n2[i5 + 3] = Number(x5 >> 24n & 0xffn), n2[i5 + 4] = Number(x5 >> 32n & 0xffn), n2[i5 + 5] = Number(x5 >> 40n & 0xffn), n2[i5 + 6] = Number(x5 >> 48n & 0xffn), n2[i5 + 7] = Number(x5 >> 56n & 0xffn);
  }
  function A(n2, i5, x5) {
    n2[i5] = Number(x5 >> 56n & 0xffn), n2[i5 + 1] = Number(x5 >> 48n & 0xffn), n2[i5 + 2] = Number(x5 >> 40n & 0xffn), n2[i5 + 3] = Number(x5 >> 32n & 0xffn), n2[i5 + 4] = Number(x5 >> 24n & 0xffn), n2[i5 + 5] = Number(x5 >> 16n & 0xffn), n2[i5 + 6] = Number(x5 >> 8n & 0xffn), n2[i5 + 7] = Number(x5 & 0xffn);
  }
  function C(n2, i5, x5, g2) {
    g2 ? (n2[i5] = Number(x5 & 0xffn), n2[i5 + 1] = Number(x5 >> 8n & 0xffn), n2[i5 + 2] = Number(x5 >> 16n & 0xffn), n2[i5 + 3] = Number(x5 >> 24n & 0xffn), n2[i5 + 4] = Number(x5 >> 32n & 0xffn), n2[i5 + 5] = Number(x5 >> 40n & 0xffn), n2[i5 + 6] = Number(x5 >> 48n & 0xffn), n2[i5 + 7] = Number(x5 >> 56n & 0xffn)) : (n2[i5] = Number(x5 >> 56n & 0xffn), n2[i5 + 1] = Number(x5 >> 48n & 0xffn), n2[i5 + 2] = Number(x5 >> 40n & 0xffn), n2[i5 + 3] = Number(x5 >> 32n & 0xffn), n2[i5 + 4] = Number(x5 >> 24n & 0xffn), n2[i5 + 5] = Number(x5 >> 16n & 0xffn), n2[i5 + 6] = Number(x5 >> 8n & 0xffn), n2[i5 + 7] = Number(x5 & 0xffn));
  }
  function F(n2, i5) {
    return n2[i5] << 24 >> 24;
  }
  function K(n2, i5, x5) {
    return x5 ? n2[i5] | n2[i5 + 1] << 8 : n2[i5 + 1] | n2[i5] << 8;
  }
  function P(n2, i5, x5, g2) {
    g2 ? (n2[i5] = x5, n2[i5 + 1] = x5 >> 8) : (n2[i5] = x5 >> 8, n2[i5 + 1] = x5);
  }
  function R(n2, i5) {
    return (n2[i5] | n2[i5 + 1] << 8 | n2[i5 + 2] << 16 | n2[i5 + 3] << 24) >>> 0;
  }
  function T(n2, i5, x5) {
    return x5 ? (n2[i5] | n2[i5 + 1] << 8 | n2[i5 + 2] << 16 | n2[i5 + 3] << 24) >>> 0 : (n2[i5] << 24 | n2[i5 + 1] << 16 | n2[i5 + 2] << 8 | n2[i5 + 3]) >>> 0;
  }
  function V(n2, i5, x5) {
    n2[i5] = x5, n2[i5 + 1] = x5 >> 8, n2[i5 + 2] = x5 >> 16, n2[i5 + 3] = x5 >> 24;
  }
  function X(n2, i5, x5, g2) {
    g2 ? (n2[i5] = x5, n2[i5 + 1] = x5 >> 8, n2[i5 + 2] = x5 >> 16, n2[i5 + 3] = x5 >> 24) : (n2[i5] = x5 >> 24, n2[i5 + 1] = x5 >> 16, n2[i5 + 2] = x5 >> 8, n2[i5 + 3] = x5);
  }
  function _(n2, i5) {
    return BigInt(n2[i5]) << 56n | BigInt(n2[i5 + 1]) << 48n | BigInt(n2[i5 + 2]) << 40n | BigInt(n2[i5 + 3]) << 32n | BigInt(n2[i5 + 4]) << 24n | BigInt(n2[i5 + 5]) << 16n | BigInt(n2[i5 + 6]) << 8n | BigInt(n2[i5 + 7]);
  }
  function $(n2, i5, x5) {
    return x5 ? BigInt(n2[i5]) | BigInt(n2[i5 + 1]) << 8n | BigInt(n2[i5 + 2]) << 16n | BigInt(n2[i5 + 3]) << 24n | BigInt(n2[i5 + 4]) << 32n | BigInt(n2[i5 + 5]) << 40n | BigInt(n2[i5 + 6]) << 48n | BigInt(n2[i5 + 7]) << 56n : BigInt(n2[i5]) << 56n | BigInt(n2[i5 + 1]) << 48n | BigInt(n2[i5 + 2]) << 40n | BigInt(n2[i5 + 3]) << 32n | BigInt(n2[i5 + 4]) << 24n | BigInt(n2[i5 + 5]) << 16n | BigInt(n2[i5 + 6]) << 8n | BigInt(n2[i5 + 7]);
  }
  function l(n2, i5, x5, g2) {
    g2 ? (n2[i5] = Number(x5 & 0xffn), n2[i5 + 1] = Number(x5 >> 8n & 0xffn), n2[i5 + 2] = Number(x5 >> 16n & 0xffn), n2[i5 + 3] = Number(x5 >> 24n & 0xffn), n2[i5 + 4] = Number(x5 >> 32n & 0xffn), n2[i5 + 5] = Number(x5 >> 40n & 0xffn), n2[i5 + 6] = Number(x5 >> 48n & 0xffn), n2[i5 + 7] = Number(x5 >> 56n & 0xffn)) : (n2[i5] = Number(x5 >> 56n & 0xffn), n2[i5 + 1] = Number(x5 >> 48n & 0xffn), n2[i5 + 2] = Number(x5 >> 40n & 0xffn), n2[i5 + 3] = Number(x5 >> 32n & 0xffn), n2[i5 + 4] = Number(x5 >> 24n & 0xffn), n2[i5 + 5] = Number(x5 >> 16n & 0xffn), n2[i5 + 6] = Number(x5 >> 8n & 0xffn), n2[i5 + 7] = Number(x5 & 0xffn));
  }

  // http-url:https://esm.sh/@yume-chan/struct@2.0.1/es2022/struct.mjs
  function D(e, n2) {
    for (; ; ) {
      let { done: t2, value: r } = e.next(n2);
      if (t2) return r;
      if (p(r)) return r.then((i5) => D(e, { resolved: i5 }), (i5) => D(e, { error: i5 }));
      n2 = r;
    }
  }
  function k(e, n2) {
    function t2(...r) {
      let i5 = e.call(this, function* (o3) {
        if (p(o3)) {
          let s = yield o3;
          if ("resolved" in s) return s.resolved;
          throw s.error;
        }
        return o3;
      }, ...r);
      return D(i5, void 0);
    }
    return n2 ? t2.bind(n2) : t2;
  }
  function L(e) {
    return (n2, t2) => {
      if ("buffer" in t2) {
        let r = e(n2, t2);
        return t2.buffer.set(r, t2.index), r.length;
      } else return e(n2, t2);
    };
  }
  function T2(e, n2) {
    return (t2, r) => {
      if ("buffer" in r) return r.index ?? (r.index = 0), n2(t2, r), e;
      {
        let i5 = new Uint8Array(e);
        return n2(t2, { buffer: i5, index: 0, littleEndian: r.littleEndian }), i5;
      }
    };
  }
  function J(e, n2, t2, r, i5) {
    let o3 = { size: e, type: n2, serialize: n2 === "default" ? L(t2) : T2(e, t2), deserialize: k(r), omitInit: i5?.omitInit };
    return i5?.init && (o3.init = i5.init), o3;
  }
  var f = J;
  var E = new Uint8Array(0);
  function K2(e, n2) {
    return typeof e == "number" ? n2 ? e === 0 ? f(0, "byob", () => {
    }, function* () {
      return n2.convert(E);
    }) : f(e, "byob", (t2, { buffer: r, index: i5 }) => {
      r.set(t2.slice(0, e), i5);
    }, function* (t2, r) {
      let i5 = yield* t2(r.readExactly(e));
      return n2.convert(i5);
    }, { init(t2) {
      return n2.back(t2);
    } }) : e === 0 ? f(0, "byob", () => {
    }, function* () {
      return E;
    }) : f(e, "byob", (t2, { buffer: r, index: i5 }) => {
      r.set(t2.slice(0, e), i5);
    }, function* (t2, r) {
      return r.readExactly(e);
    }) : (typeof e == "object" || typeof e == "function") && "serialize" in e ? n2 ? f(e.size, "default", (t2, { littleEndian: r }) => {
      if (e.type === "default") {
        let i5 = e.serialize(t2.length, { littleEndian: r }), o3 = new Uint8Array(i5.length + t2.length);
        return o3.set(i5, 0), o3.set(t2, i5.length), o3;
      } else {
        let i5 = new Uint8Array(e.size + t2.length);
        return e.serialize(t2.length, { buffer: i5, index: 0, littleEndian: r }), i5.set(t2, e.size), i5;
      }
    }, function* (t2, r, i5) {
      let o3 = yield* t2(e.deserialize(r, i5)), s = yield* t2(r.readExactly(o3));
      return n2.convert(s);
    }, { init(t2) {
      return n2.back(t2);
    } }) : f(e.size, "default", (t2, { littleEndian: r }) => {
      if (e.type === "default") {
        let i5 = e.serialize(t2.length, { littleEndian: r }), o3 = new Uint8Array(i5.length + t2.length);
        return o3.set(i5, 0), o3.set(t2, i5.length), o3;
      } else {
        let i5 = new Uint8Array(e.size + t2.length);
        return e.serialize(t2.length, { buffer: i5, index: 0, littleEndian: r }), i5.set(t2, e.size), i5;
      }
    }, function* (t2, r, i5) {
      let o3 = yield* t2(e.deserialize(r, i5));
      return yield* t2(r.readExactly(o3));
    }) : typeof e == "string" ? n2 ? f(0, "default", (t2) => t2, function* (t2, r, { dependencies: i5 }) {
      let o3 = i5[e];
      return o3 === 0 ? E : r.readExactly(o3);
    }, { init(t2, r) {
      let i5 = n2.back(t2);
      return r[e] = i5.length, i5;
    } }) : f(0, "default", (t2) => t2, function* (t2, r, { dependencies: i5 }) {
      let o3 = i5[e];
      return o3 === 0 ? E : r.readExactly(o3);
    }, { init(t2, r) {
      r[e] = t2.length;
    } }) : n2 ? f(0, "default", (t2) => t2, function* (t2, r, { dependencies: i5 }) {
      let o3 = i5[e.field], s = e.convert(o3);
      return s === 0 ? E : r.readExactly(s);
    }, { init(t2, r) {
      let i5 = n2.back(t2);
      return r[e.field] = e.back(i5.length), i5;
    } }) : f(0, "default", (t2) => t2, function* (t2, r, { dependencies: i5 }) {
      let o3 = i5[e.field], s = e.convert(o3);
      return s === 0 ? E : r.readExactly(s);
    }, { init(t2, r) {
      r[e.field] = e.back(t2.length);
    } });
  }
  var S = K2;
  var U2 = class extends Error {
    constructor() {
      super("ExactReadable ended");
    }
  };
  var _e2, _t2, _a2;
  var q = (_a2 = class {
    constructor(n2) {
      __privateAdd(this, _e2);
      __privateAdd(this, _t2);
      __privateSet(this, _e2, n2), __privateSet(this, _t2, 0);
    }
    get position() {
      return __privateGet(this, _t2);
    }
    readExactly(n2) {
      if (__privateGet(this, _t2) + n2 > __privateGet(this, _e2).length) throw new U2();
      let t2 = __privateGet(this, _e2).subarray(__privateGet(this, _t2), __privateGet(this, _t2) + n2);
      return __privateSet(this, _t2, __privateGet(this, _t2) + n2), t2;
    }
  }, _e2 = new WeakMap(), _t2 = new WeakMap(), _a2);
  var g = class extends Error {
    constructor(n2) {
      super(n2);
    }
  };
  var _2 = class extends g {
    constructor() {
      super("The underlying readable was ended before the struct was fully deserialized");
    }
  };
  var P2 = class extends g {
    constructor() {
      super("The underlying readable doesn't contain any more struct");
    }
  };
  function j2(e, n2) {
    let t2 = Object.entries(e), r = 0, i5 = true;
    for (let [, b5] of t2) r += b5.size, i5 && b5.type !== "byob" && (i5 = false);
    let o3 = n2.littleEndian, s = n2.extra ? Object.getOwnPropertyDescriptors(n2.extra) : void 0;
    return { littleEndian: o3, fields: e, extra: n2.extra, type: i5 ? "byob" : "default", size: r, serialize(b5, c3) {
      let p7 = { ...b5 };
      for (let [a4, d5] of t2) if (a4 in p7 && "init" in d5) {
        let z3 = d5.init?.(p7[a4], p7);
        z3 !== void 0 && (p7[a4] = z3);
      }
      let u6 = new Array(t2.length), m6 = new Array(t2.length);
      {
        let a4 = { littleEndian: o3 };
        for (let [d5, [z3, I3]] of t2.entries()) I3.type === "byob" ? u6[d5] = I3.size : (m6[d5] = I3.serialize(p7[z3], a4), u6[d5] = m6[d5].length);
      }
      let l8 = u6.reduce((a4, d5) => a4 + d5, 0), w4, x5, h4;
      if (c3 instanceof Uint8Array) {
        if (c3.length < l8) throw new Error("Buffer too small");
        w4 = true, x5 = c3, h4 = 0;
      } else if (typeof c3 == "object" && "buffer" in c3) {
        if (w4 = true, x5 = c3.buffer, h4 = c3.index ?? 0, x5.length - h4 < l8) throw new Error("Buffer too small");
      } else w4 = false, x5 = new Uint8Array(l8), h4 = 0;
      let A5 = { buffer: x5, index: h4, littleEndian: o3 };
      for (let [a4, [d5, z3]] of t2.entries()) m6[a4] ? x5.set(m6[a4], A5.index) : z3.serialize(p7[d5], A5), A5.index += u6[a4];
      return w4 ? l8 : x5;
    }, deserialize: k(function* (b5, c3) {
      let p7 = c3.position, u6 = {}, m6 = { dependencies: u6, littleEndian: o3 };
      try {
        for (let [l8, w4] of t2) u6[l8] = yield* b5(w4.deserialize(c3, m6));
      } catch (l8) {
        throw l8 instanceof U2 ? c3.position === p7 ? new P2() : new _2() : l8;
      }
      return s && Object.defineProperties(u6, s), n2.postDeserialize ? n2.postDeserialize.call(u6, u6) : u6;
    }) };
  }
  function kt(e, n2, t2) {
    return j2(Object.assign({}, e.fields, n2), { littleEndian: t2?.littleEndian ?? e.littleEndian, extra: e.extra, postDeserialize: t2?.postDeserialize });
  }
  function y2(e, n2, t2) {
    let r = () => r;
    return Object.assign(r, f(e, "byob", n2, t2)), r;
  }
  var It = y2(1, (e, { buffer: n2, index: t2 }) => {
    n2[t2] = e;
  }, function* (e, n2) {
    return (yield* e(n2.readExactly(1)))[0];
  });
  var Dt = y2(1, (e, { buffer: n2, index: t2 }) => {
    n2[t2] = e;
  }, function* (e, n2) {
    let t2 = yield* e(n2.readExactly(1));
    return F(t2, 0);
  });
  var _t3 = y2(2, (e, { buffer: n2, index: t2, littleEndian: r }) => {
    P(n2, t2, e, r);
  }, function* (e, n2, { littleEndian: t2 }) {
    let r = yield* e(n2.readExactly(2));
    return K(r, 0, t2);
  });
  var Pt = y2(2, (e, { buffer: n2, index: t2, littleEndian: r }) => {
    p2(n2, t2, e, r);
  }, function* (e, n2, { littleEndian: t2 }) {
    let r = yield* e(n2.readExactly(2));
    return t(r, 0, t2);
  });
  var Bt = y2(4, (e, { buffer: n2, index: t2, littleEndian: r }) => {
    X(n2, t2, e, r);
  }, function* (e, n2, { littleEndian: t2 }) {
    let r = yield* e(n2.readExactly(4));
    return T(r, 0, t2);
  });
  var Lt = y2(4, (e, { buffer: n2, index: t2, littleEndian: r }) => {
    j(n2, t2, e, r);
  }, function* (e, n2, { littleEndian: t2 }) {
    let r = yield* e(n2.readExactly(4));
    return U(r, 0, t2);
  });
  var Tt = y2(8, (e, { buffer: n2, index: t2, littleEndian: r }) => {
    l(n2, t2, e, r);
  }, function* (e, n2, { littleEndian: t2 }) {
    let r = yield* e(n2.readExactly(8));
    return $(r, 0, t2);
  });
  var St = y2(8, (e, { buffer: n2, index: t2, littleEndian: r }) => {
    C(n2, t2, e, r);
  }, function* (e, n2, { littleEndian: t2 }) {
    let r = yield* e(n2.readExactly(8));
    return y(r, 0, t2);
  });
  var { TextEncoder: O, TextDecoder: tt } = globalThis;
  var et = new O();
  var rt = new tt();
  function G(e) {
    return et.encode(e);
  }
  function H(e) {
    return rt.decode(e);
  }
  var Kt = (e) => {
    let n2 = S(e, { convert: H, back: G });
    return n2.as = () => n2, n2;
  };

  // http-url:https://esm.sh/@yume-chan/adb@2.3.1/es2022/esm/utils/index.mjs
  var [l2, f2, i] = (() => {
    let r = [], e = [];
    function o3(n2, t2) {
      let c3 = n2.charCodeAt(0), h4 = t2.charCodeAt(0);
      for (let a4 = c3; a4 <= h4; a4 += 1) r[a4] = e.length, e.push(a4);
    }
    return o3("A", "Z"), o3("a", "z"), o3("0", "9"), o3("+", "+"), o3("/", "/"), [r, e, 61];
  })();
  function w(r) {
    let e = r % 3, s = e !== 0 ? 3 - e : 0;
    return [(r + s) / 3 * 4, s];
  }
  function O2(r, e) {
    let [s, o3] = w(r.length);
    if (e) {
      if (e.length < s) throw new TypeError("output buffer is too small");
      if (e = e.subarray(0, s), r.buffer !== e.buffer) d(r, e, o3);
      else if (e.byteOffset + e.length - (o3 + 1) <= r.byteOffset + r.length) d(r, e, o3);
      else if (e.byteOffset >= r.byteOffset - 1) y3(r, e, o3);
      else throw new TypeError("input and output cannot overlap");
      return s;
    } else return e = new Uint8Array(s), d(r, e, o3), e;
  }
  function d(r, e, s) {
    let o3 = 0, n2 = 0;
    for (; o3 < r.length - 2; ) {
      let t2 = r[o3];
      o3 += 1;
      let c3 = r[o3];
      o3 += 1;
      let h4 = r[o3];
      o3 += 1, e[n2] = f2[t2 >> 2], n2 += 1, e[n2] = f2[(t2 & 3) << 4 | c3 >> 4], n2 += 1, e[n2] = f2[(c3 & 15) << 2 | h4 >> 6], n2 += 1, e[n2] = f2[h4 & 63], n2 += 1;
    }
    if (s === 2) {
      let t2 = r[o3];
      o3 += 1, e[n2] = f2[t2 >> 2], n2 += 1, e[n2] = f2[(t2 & 3) << 4], n2 += 1, e[n2] = i, n2 += 1, e[n2] = i;
    } else if (s === 1) {
      let t2 = r[o3];
      o3 += 1;
      let c3 = r[o3];
      o3 += 1, e[n2] = f2[t2 >> 2], n2 += 1, e[n2] = f2[(t2 & 3) << 4 | c3 >> 4], n2 += 1, e[n2] = f2[(c3 & 15) << 2], n2 += 1, e[n2] = i;
    }
  }
  function y3(r, e, s) {
    let o3 = r.length - 1, n2 = e.length - 1;
    if (s === 2) {
      let t2 = r[o3];
      o3 -= 1, e[n2] = i, n2 -= 1, e[n2] = i, n2 -= 1, e[n2] = f2[(t2 & 3) << 4], n2 -= 1, e[n2] = f2[t2 >> 2], n2 -= 1;
    } else if (s === 1) {
      let t2 = r[o3];
      o3 -= 1;
      let c3 = r[o3];
      o3 -= 1, e[n2] = i, n2 -= 1, e[n2] = f2[(t2 & 15) << 2], n2 -= 1, e[n2] = f2[(c3 & 3) << 4 | t2 >> 4], n2 -= 1, e[n2] = f2[c3 >> 2], n2 -= 1;
    }
    for (; o3 >= 0; ) {
      let t2 = r[o3];
      o3 -= 1;
      let c3 = r[o3];
      o3 -= 1;
      let h4 = r[o3];
      o3 -= 1, e[n2] = f2[t2 & 63], n2 -= 1, e[n2] = f2[(c3 & 15) << 2 | t2 >> 6], n2 -= 1, e[n2] = f2[(h4 & 3) << 4 | c3 >> 4], n2 -= 1, e[n2] = f2[h4 >> 2], n2 -= 1;
    }
  }
  function N(...r) {
    throw new Error(`Unreachable. Arguments:
` + r.join(`
`));
  }
  var { setInterval: m, clearInterval: A2 } = globalThis;

  // http-url:https://esm.sh/@yume-chan/event@2.0.0/es2022/event.mjs
  var i2 = class {
    constructor() {
      __publicField(this, "listeners", []);
      __publicField(this, "event", (s, e, ...t2) => {
        let p7 = { listener: s, thisArg: e, args: t2 };
        return this.addEventListener(p7);
      });
      this.event = this.event.bind(this);
    }
    addEventListener(s) {
      this.listeners.push(s);
      let e = () => {
        let t2 = this.listeners.indexOf(s);
        t2 !== -1 && this.listeners.splice(t2, 1);
      };
      return e.dispose = e, e;
    }
    fire(s) {
      for (let e of this.listeners.slice()) e.listener.call(e.thisArg, s, ...e.args);
    }
    dispose() {
      this.listeners.length = 0;
    }
  };
  var d2 = Symbol("undefined");
  var _s2, _a3;
  var l3 = (_a3 = class extends i2 {
    constructor() {
      super(...arguments);
      __privateAdd(this, _s2, d2);
    }
    addEventListener(s) {
      return __privateGet(this, _s2) !== d2 && s.listener.call(s.thisArg, __privateGet(this, _s2), ...s.args), super.addEventListener(s);
    }
    fire(s) {
      __privateSet(this, _s2, s), super.fire(s);
    }
  }, _s2 = new WeakMap(), _a3);

  // http-url:https://esm.sh/@yume-chan/stream-extra@2.1.0/es2022/esm/maybe-consumable/index.mjs
  var maybe_consumable_exports = {};
  __export(maybe_consumable_exports, {
    WrapWritableStream: () => h2,
    WritableStream: () => w2,
    getValue: () => X2,
    tryConsume: () => b
  });
  var { AbortController: C2 } = globalThis;
  var c = (() => {
    let { ReadableStream: a4 } = globalThis;
    return a4.from || (a4.from = function(t2) {
      let r = Symbol.asyncIterator in t2 ? t2[Symbol.asyncIterator]() : t2[Symbol.iterator]();
      return new a4({ async pull(e) {
        let o3 = await r.next();
        if (o3.done) {
          e.close();
          return;
        }
        e.enqueue(o3.value);
      }, async cancel(e) {
        await r.return?.(e);
      } });
    }), (!a4.prototype[Symbol.asyncIterator] || !a4.prototype.values) && (a4.prototype.values = async function* (t2) {
      let r = this.getReader();
      try {
        for (; ; ) {
          let { done: e, value: o3 } = await r.read();
          if (e) return;
          yield o3;
        }
      } finally {
        t2?.preventCancel || await r.cancel(), r.releaseLock();
      }
    }, a4.prototype[Symbol.asyncIterator] = a4.prototype.values), a4;
  })();
  var { WritableStream: u, TransformStream: R2 } = globalThis;
  var l4 = class a extends c {
    static async enqueue(t2, r) {
      let e = new i3(r);
      t2.enqueue(e), await e.consumed;
    }
    constructor(t2, r) {
      let e, o3;
      r && (o3 = {}, "highWaterMark" in r && (o3.highWaterMark = r.highWaterMark), "size" in r && (o3.size = (s) => r.size(s.value))), super({ start(s) {
        return e = { enqueue(n2) {
          return a.enqueue(s, n2);
        }, close() {
          s.close();
        }, error(n2) {
          s.error(n2);
        } }, t2.start?.(e);
      }, pull() {
        return t2.pull?.(e);
      }, cancel(s) {
        return t2.cancel?.(s);
      } }, o3);
    }
  };
  var m2 = class extends c {
    constructor(t2, r, e) {
      let o3 = t2.getReader({ mode: "byob" }), s = new Uint8Array(r);
      super({ async pull(n2) {
        let { done: S4, value: d5 } = await o3.read(s, { min: e });
        if (S4) {
          n2.close();
          return;
        }
        await l4.enqueue(n2, d5), s = new Uint8Array(d5.buffer);
      }, cancel(n2) {
        return o3.cancel(n2);
      } });
    }
  };
  var p3 = class extends u {
    constructor(t2) {
      let r = t2.getWriter();
      super({ write(e) {
        return e.tryConsume((o3) => r.write(o3));
      }, abort(e) {
        return r.abort(e);
      }, close() {
        return r.close();
      } });
    }
  };
  var f3 = class extends u {
    static async write(t2, r) {
      let e = new i3(r);
      await t2.write(e), await e.consumed;
    }
    constructor(t2, r) {
      let e;
      r && (e = {}, "highWaterMark" in r && (e.highWaterMark = r.highWaterMark), "size" in r && (e.size = (o3) => r.size(o3 instanceof i3 ? o3.value : o3))), super({ start(o3) {
        return t2.start?.(o3);
      }, write(o3, s) {
        return o3.tryConsume((n2) => t2.write?.(n2, s));
      }, abort(o3) {
        return t2.abort?.(o3);
      }, close() {
        return t2.close?.();
      } }, e);
    }
  };
  var { console: x } = globalThis;
  var y4 = x?.createTask?.bind(x) ?? (() => ({ run(a4) {
    return a4();
  } }));
  var _a4, _e3, _r2;
  var i3 = (_a4 = class {
    constructor(t2) {
      __privateAdd(this, _e3);
      __privateAdd(this, _r2);
      __publicField(this, "value");
      __publicField(this, "consumed");
      __privateSet(this, _e3, y4("Consumable")), this.value = t2, __privateSet(this, _r2, new o()), this.consumed = __privateGet(this, _r2).promise;
    }
    consume() {
      __privateGet(this, _r2).resolve();
    }
    error(t2) {
      __privateGet(this, _r2).reject(t2);
    }
    tryConsume(t2) {
      try {
        let r = __privateGet(this, _e3).run(() => t2(this.value));
        return p(r) ? r = r.then((e) => (__privateGet(this, _r2).resolve(), e), (e) => {
          throw __privateGet(this, _r2).reject(e), e;
        }) : __privateGet(this, _r2).resolve(), r;
      } catch (r) {
        throw __privateGet(this, _r2).reject(r), r;
      }
    }
  }, _e3 = new WeakMap(), _r2 = new WeakMap(), __publicField(_a4, "WritableStream", f3), __publicField(_a4, "WrapWritableStream", p3), __publicField(_a4, "ReadableStream", l4), __publicField(_a4, "WrapByteReadableStream", m2), _a4);
  function X2(a4) {
    return a4 instanceof i3 ? a4.value : a4;
  }
  function b(a4, t2) {
    return a4 instanceof i3 ? a4.tryConsume(t2) : t2(a4);
  }
  var h2 = class extends u {
    constructor(t2) {
      let r = t2.getWriter();
      super({ write(e) {
        return b(e, (o3) => r.write(o3));
      }, abort(e) {
        return r.abort(e);
      }, close() {
        return r.close();
      } });
    }
  };
  var w2 = class extends u {
    constructor(t2, r) {
      let e;
      r && (e = {}, "highWaterMark" in r && (e.highWaterMark = r.highWaterMark), "size" in r && (e.size = (o3) => r.size(o3 instanceof i3 ? o3.value : o3))), super({ start(o3) {
        return t2.start?.(o3);
      }, write(o3, s) {
        return b(o3, (n2) => t2.write?.(n2, s));
      }, abort(o3) {
        return t2.abort?.(o3);
      }, close() {
        return t2.close?.();
      } }, e);
    }
  };

  // http-url:https://esm.sh/@yume-chan/stream-extra@2.1.0/es2022/stream-extra.mjs
  var { AbortController: W } = globalThis;
  var u2 = (() => {
    let { ReadableStream: a4 } = globalThis;
    return a4.from || (a4.from = function(e) {
      let r = Symbol.asyncIterator in e ? e[Symbol.asyncIterator]() : e[Symbol.iterator]();
      return new a4({ async pull(t2) {
        let s = await r.next();
        if (s.done) {
          t2.close();
          return;
        }
        t2.enqueue(s.value);
      }, async cancel(t2) {
        await r.return?.(t2);
      } });
    }), (!a4.prototype[Symbol.asyncIterator] || !a4.prototype.values) && (a4.prototype.values = async function* (e) {
      let r = this.getReader();
      try {
        for (; ; ) {
          let { done: t2, value: s } = await r.read();
          if (t2) return;
          yield s;
        }
      } finally {
        e?.preventCancel || await r.cancel(), r.releaseLock();
      }
    }, a4.prototype[Symbol.asyncIterator] = a4.prototype.values), a4;
  })();
  var { WritableStream: l5, TransformStream: f4 } = globalThis;
  var m3 = class extends u2 {
    constructor(e, r, t2) {
      let s, o3 = false, i5 = new W();
      super({ start: (n2) => {
        let h4 = e({ abortSignal: i5.signal, enqueue: async (c3) => {
          if (t2?.({ source: "producer", operation: "enqueue", value: c3, phase: "start" }), i5.signal.aborted) {
            t2?.({ source: "producer", operation: "enqueue", value: c3, phase: "ignored" });
            return;
          }
          if (n2.desiredSize === null) {
            n2.enqueue(c3);
            return;
          }
          if (o3) {
            o3 = false, n2.enqueue(c3), t2?.({ source: "producer", operation: "enqueue", value: c3, phase: "complete" });
            return;
          }
          if (n2.desiredSize <= 0 && (t2?.({ source: "producer", operation: "enqueue", value: c3, phase: "waiting" }), s = new o(), await s.promise, i5.signal.aborted)) {
            t2?.({ source: "producer", operation: "enqueue", value: c3, phase: "ignored" });
            return;
          }
          n2.enqueue(c3), t2?.({ source: "producer", operation: "enqueue", value: c3, phase: "complete" });
        }, close() {
          if (t2?.({ source: "producer", operation: "close", explicit: true, phase: "start" }), i5.signal.aborted) {
            t2?.({ source: "producer", operation: "close", explicit: true, phase: "ignored" });
            return;
          }
          n2.close(), t2?.({ source: "producer", operation: "close", explicit: true, phase: "complete" });
        }, error(c3) {
          t2?.({ source: "producer", operation: "error", explicit: true, phase: "start" }), n2.error(c3), t2?.({ source: "producer", operation: "error", explicit: true, phase: "complete" });
        } });
        h4 && "then" in h4 && h4.then(() => {
          t2?.({ source: "producer", operation: "close", explicit: false, phase: "start" });
          try {
            n2.close(), t2?.({ source: "producer", operation: "close", explicit: false, phase: "complete" });
          } catch {
            t2?.({ source: "producer", operation: "close", explicit: false, phase: "ignored" });
          }
        }, (c3) => {
          t2?.({ source: "producer", operation: "error", explicit: false, phase: "start" }), n2.error(c3), t2?.({ source: "producer", operation: "error", explicit: false, phase: "complete" });
        });
      }, pull: () => {
        t2?.({ source: "consumer", operation: "pull", phase: "start" }), s ? s.resolve() : r?.highWaterMark === 0 && (o3 = true), t2?.({ source: "consumer", operation: "pull", phase: "complete" });
      }, cancel: (n2) => {
        t2?.({ source: "consumer", operation: "cancel", phase: "start" }), i5.abort(n2), s?.resolve(), t2?.({ source: "consumer", operation: "cancel", phase: "complete" });
      } }, r);
    }
  };
  function R3(a4) {
    try {
      return a4.close(), true;
    } catch {
      return false;
    }
  }
  var d3 = class a2 extends u2 {
    static async enqueue(e, r) {
      let t2 = new p4(r);
      e.enqueue(t2), await t2.consumed;
    }
    constructor(e, r) {
      let t2, s;
      r && (s = {}, "highWaterMark" in r && (s.highWaterMark = r.highWaterMark), "size" in r && (s.size = (o3) => r.size(o3.value))), super({ start(o3) {
        return t2 = { enqueue(i5) {
          return a2.enqueue(o3, i5);
        }, close() {
          o3.close();
        }, error(i5) {
          o3.error(i5);
        } }, e.start?.(t2);
      }, pull() {
        return e.pull?.(t2);
      }, cancel(o3) {
        return e.cancel?.(o3);
      } }, s);
    }
  };
  var y5 = class extends u2 {
    constructor(e, r, t2) {
      let s = e.getReader({ mode: "byob" }), o3 = new Uint8Array(r);
      super({ async pull(i5) {
        let { done: n2, value: h4 } = await s.read(o3, { min: t2 });
        if (n2) {
          i5.close();
          return;
        }
        await d3.enqueue(i5, h4), o3 = new Uint8Array(h4.buffer);
      }, cancel(i5) {
        return s.cancel(i5);
      } });
    }
  };
  var x2 = class extends l5 {
    constructor(e) {
      let r = e.getWriter();
      super({ write(t2) {
        return t2.tryConsume((s) => r.write(s));
      }, abort(t2) {
        return r.abort(t2);
      }, close() {
        return r.close();
      } });
    }
  };
  var v = class extends l5 {
    static async write(e, r) {
      let t2 = new p4(r);
      await e.write(t2), await t2.consumed;
    }
    constructor(e, r) {
      let t2;
      r && (t2 = {}, "highWaterMark" in r && (t2.highWaterMark = r.highWaterMark), "size" in r && (t2.size = (s) => r.size(s instanceof p4 ? s.value : s))), super({ start(s) {
        return e.start?.(s);
      }, write(s, o3) {
        return s.tryConsume((i5) => e.write?.(i5, o3));
      }, abort(s) {
        return e.abort?.(s);
      }, close() {
        return e.close?.();
      } }, t2);
    }
  };
  var { console: P3 } = globalThis;
  var A3 = P3?.createTask?.bind(P3) ?? (() => ({ run(a4) {
    return a4();
  } }));
  var _a5, _t4, _e4;
  var p4 = (_a5 = class {
    constructor(e) {
      __privateAdd(this, _t4);
      __privateAdd(this, _e4);
      __publicField(this, "value");
      __publicField(this, "consumed");
      __privateSet(this, _t4, A3("Consumable")), this.value = e, __privateSet(this, _e4, new o()), this.consumed = __privateGet(this, _e4).promise;
    }
    consume() {
      __privateGet(this, _e4).resolve();
    }
    error(e) {
      __privateGet(this, _e4).reject(e);
    }
    tryConsume(e) {
      try {
        let r = __privateGet(this, _t4).run(() => e(this.value));
        return p(r) ? r = r.then((t2) => (__privateGet(this, _e4).resolve(), t2), (t2) => {
          throw __privateGet(this, _e4).reject(t2), t2;
        }) : __privateGet(this, _e4).resolve(), r;
      } catch (r) {
        throw __privateGet(this, _e4).reject(r), r;
      }
    }
  }, _t4 = new WeakMap(), _e4 = new WeakMap(), __publicField(_a5, "WritableStream", v), __publicField(_a5, "WrapWritableStream", x2), __publicField(_a5, "ReadableStream", d3), __publicField(_a5, "WrapByteReadableStream", y5), _a5);
  function Y(a4, e) {
    return "start" in a4 ? a4.start(e) : typeof a4 == "function" ? a4(e) : a4;
  }
  var _t5, _a6;
  var S2 = (_a6 = class extends u2 {
    constructor(e, r) {
      super({ start: async (t2) => {
        let s = await Y(e, t2);
        this.readable = s, __privateSet(this, _t5, this.readable.getReader());
      }, pull: async (t2) => {
        let { done: s, value: o3 } = await __privateGet(this, _t5).read().catch((i5) => {
          throw "error" in e && e.error(i5), i5;
        });
        s ? (t2.close(), "close" in e && await e.close?.()) : t2.enqueue(o3);
      }, cancel: async (t2) => {
        await __privateGet(this, _t5).cancel(t2), "cancel" in e && await e.cancel?.(t2);
      } }, r);
      __publicField(this, "readable");
      __privateAdd(this, _t5);
    }
  }, _t5 = new WeakMap(), _a6);
  var U3 = () => {
  };
  var _t6, _e5, _s3, _r3, _a7, _a8;
  var L2 = (_a8 = class {
    constructor(e) {
      __privateAdd(this, _t6, []);
      __privateAdd(this, _e5, []);
      __privateAdd(this, _s3, false);
      __privateAdd(this, _r3, new o());
      __privateAdd(this, _a7);
      __privateSet(this, _a7, e ?? {});
    }
    get writableClosed() {
      return __privateGet(this, _s3);
    }
    get closed() {
      return __privateGet(this, _r3).promise;
    }
    wrapReadable(e, r) {
      return new S2({ start: (t2) => (__privateGet(this, _t6).push(t2), e), cancel: async () => {
        await this.close();
      }, close: async () => {
        await this.dispose();
      } }, r);
    }
    createWritable(e) {
      let r = e.getWriter();
      return __privateGet(this, _e5).push(r), new l5({ write: async (t2) => {
        await r.write(t2);
      }, abort: async (t2) => {
        await r.abort(t2), await this.close();
      }, close: async () => {
        await r.close().catch(U3), await this.close();
      } });
    }
    async close() {
      if (!__privateGet(this, _s3)) {
        __privateSet(this, _s3, true), await __privateGet(this, _a7).close?.() !== false && await this.dispose();
        for (let e of __privateGet(this, _e5)) e.close().catch(U3);
      }
    }
    async dispose() {
      __privateSet(this, _s3, true), __privateGet(this, _r3).resolve();
      for (let e of __privateGet(this, _t6)) R3(e);
      await __privateGet(this, _a7).dispose?.();
    }
  }, _t6 = new WeakMap(), _e5 = new WeakMap(), _s3 = new WeakMap(), _r3 = new WeakMap(), _a7 = new WeakMap(), _a8);
  var O3 = globalThis;
  var Ze = O3.TextDecoderStream;
  var $e = O3.TextEncoderStream;
  function tt2(a4, e) {
    let r = e.writable.getWriter(), t2 = e.readable.pipeTo(a4);
    return new l5({ async write(s) {
      await r.write(s);
    }, async close() {
      await r.close(), await t2;
    } });
  }

  // http-url:https://esm.sh/@yume-chan/adb@2.3.1/es2022/adb.mjs
  var Ut = j2({ version: Bt }, { littleEndian: true });
  var Nt = j2({ bpp: Bt, size: Bt, width: Bt, height: Bt, red_offset: Bt, red_length: Bt, blue_offset: Bt, blue_length: Bt, green_offset: Bt, green_length: Bt, alpha_offset: Bt, alpha_length: Bt, data: S("size") }, { littleEndian: true });
  var zt = j2({ bpp: Bt, colorSpace: Bt, size: Bt, width: Bt, height: Bt, red_offset: Bt, red_length: Bt, blue_offset: Bt, blue_length: Bt, green_offset: Bt, green_length: Bt, alpha_offset: Bt, alpha_length: Bt, data: S("size") }, { littleEndian: true });
  var We = j2({ length: Kt(4), content: Kt({ field: "length", convert(s) {
    return Number.parseInt(s, 16);
  }, back(s) {
    return s.toString(16).padStart(4, "0");
  } }) }, { littleEndian: true });
  var B = class extends Error {
    constructor(e) {
      super(e);
    }
  };
  var Se = class extends B {
    constructor() {
      super("ADB reverse tunnel is not supported on this device when connected wirelessly.");
    }
  };
  var Kt2 = kt(We, {}, { postDeserialize(s) {
    throw s.content === "more than one device/emulator" ? new Se() : new B(s.content);
  } });
  var Gt = G("OKAY");
  var l6 = { ShellV2: "shell_v2", Cmd: "cmd", StatV2: "stat_v2", ListV2: "ls_v2", FixedPushMkdir: "fixed_push_mkdir", Abb: "abb", AbbExec: "abb_exec", SendReceiveV2: "sendrecv_v2", DelayedAck: "delayed_ack" };
  var A4 = j2({ id: It(), data: S(Bt) }, { littleEndian: true });
  function mr(s) {
    let e = new Uint8Array(s.length);
    for (let t2 = 0; t2 < s.length; t2 += 1) e[t2] = s.charCodeAt(t2);
    return e;
  }
  function u3(s) {
    let e = mr(s);
    return R(e, 0);
  }
  var m4 = { Entry: u3("DENT"), Entry2: u3("DNT2"), Lstat: u3("STAT"), Stat: u3("STA2"), Lstat2: u3("LST2"), Done: u3("DONE"), Data: u3("DATA"), Ok: u3("OKAY"), Fail: u3("FAIL") };
  var ve = class extends Error {
  };
  var Ye = j2({ message: Kt(Bt) }, { littleEndian: true, postDeserialize(s) {
    throw new ve(s.message);
  } });
  var y6 = { List: u3("LIST"), ListV2: u3("LIS2"), Send: u3("SEND"), SendV2: u3("SND2"), Lstat: u3("STAT"), Stat: u3("STA2"), LstatV2: u3("LST2"), Data: u3("DATA"), Done: u3("DONE"), Receive: u3("RECV") };
  var Xe = j2({ id: Bt, arg: Bt }, { littleEndian: true });
  var Ae = j2({ mode: Bt, size: Bt, mtime: Bt }, { littleEndian: true, extra: { get type() {
    return this.mode >> 12;
  }, get permission() {
    return this.mode & 4095;
  } }, postDeserialize(s) {
    if (s.mode === 0 && s.size === 0 && s.mtime === 0) throw new Error("lstat error");
    return s;
  } });
  var Re = { SUCCESS: 0, EACCES: 13, EEXIST: 17, EFAULT: 14, EFBIG: 27, EINTR: 4, EINVAL: 22, EIO: 5, EISDIR: 21, ELOOP: 40, EMFILE: 24, ENAMETOOLONG: 36, ENFILE: 23, ENOENT: 2, ENOMEM: 12, ENOSPC: 28, ENOTDIR: 20, EOVERFLOW: 75, EPERM: 1, EROFS: 30, ETXTBSY: 26 };
  var gr = Object.fromEntries(Object.entries(Re).map(([s, e]) => [e, s]));
  var Q = j2({ error: Bt(), dev: Tt, ino: Tt, mode: Bt, nlink: Bt, uid: Bt, gid: Bt, size: Tt, atime: Tt, mtime: Tt, ctime: Tt }, { littleEndian: true, extra: { get type() {
    return this.mode >> 12;
  }, get permission() {
    return this.mode & 4095;
  } }, postDeserialize(s) {
    if (s.error) throw new Error(gr[s.error]);
    return s;
  } });
  var xr = kt(Ae, { name: Kt(Bt) });
  var Sr = kt(Q, { name: Kt(Bt) });
  var nt = j2({ data: S(Bt) }, { littleEndian: true });
  var ct = 64 * 1024;
  var Lr = j2({ unused: Bt }, { littleEndian: true });
  var Ur = j2({ id: Bt, mode: Bt, flags: Bt() }, { littleEndian: true });
  var ne = { Product: "ro.product.name", Model: "ro.product.model", Device: "ro.product.device", Features: "features" };
  var _e6, _t7, _r4, _s4, _a9;
  var I = (_a9 = class {
    constructor(e, t2, r, n2) {
      __privateAdd(this, _e6);
      __privateAdd(this, _t7);
      __privateAdd(this, _r4);
      __privateAdd(this, _s4, []);
      __privateSet(this, _e6, e), __privateSet(this, _t7, t2), __privateSet(this, _r4, r), __privateSet(this, _s4, n2);
    }
    static parse(e) {
      let t2, r, n2, o3 = [], i5 = e.split("::");
      if (i5.length > 1) {
        let a4 = i5[1];
        for (let c3 of a4.split(";")) {
          if (!c3) continue;
          let h4 = c3.split("=");
          if (h4.length !== 2) continue;
          let [f6, b5] = h4;
          switch (f6) {
            case ne.Product:
              t2 = b5;
              break;
            case ne.Model:
              r = b5;
              break;
            case ne.Device:
              n2 = b5;
              break;
            case ne.Features:
              o3 = b5.split(",");
              break;
          }
        }
      }
      return new _a9(t2, r, n2, o3);
    }
    get product() {
      return __privateGet(this, _e6);
    }
    get model() {
      return __privateGet(this, _t7);
    }
    get device() {
      return __privateGet(this, _r4);
    }
    get features() {
      return __privateGet(this, _s4);
    }
  }, _e6 = new WeakMap(), _t7 = new WeakMap(), _r4 = new WeakMap(), _s4 = new WeakMap(), _a9);
  function Pe(s, e, t2) {
    let r = 0n;
    for (let n2 = e; n2 < e + t2; n2 += 8) {
      r <<= 64n;
      let o3 = _(s, n2);
      r |= o3;
    }
    return r;
  }
  function Ie(s, e, t2, r, n2) {
    if (n2) for (; r > 0n; ) z(s, e, r), e += 8, r >>= 64n;
    else {
      let o3 = e + t2 - 8;
      for (; r > 0n; ) A(s, o3, r), o3 -= 8, r >>= 64n;
    }
  }
  var jr = 38;
  var Gr = 2048 / 8;
  var Yr = 303;
  var Hr = 2048 / 8;
  function mt(s) {
    let e = Pe(s, jr, Gr), t2 = Pe(s, Yr, Hr);
    return [e, t2];
  }
  function pt(s, e) {
    let t2 = s % e;
    return t2 > 0 ? t2 : t2 + (e > 0 ? e : -e);
  }
  function Xr(s, e) {
    if (s = pt(s, e), !s || e < 2) return NaN;
    let t2 = [], r = e;
    for (; r; ) [s, r] = [r, s % r], t2.push({ a: s, b: r });
    if (s !== 1) return NaN;
    let n2 = 1, o3 = 0;
    for (let i5 = t2.length - 2; i5 >= 0; i5 -= 1) [n2, o3] = [o3, n2 - o3 * Math.floor(t2[i5].a / t2[i5].b)];
    return pt(o3, e);
  }
  var R4 = 2048 / 8;
  var Zr = R4 / 4;
  function De() {
    return 8 + R4 + R4 + 4;
  }
  function yt(s, e) {
    let t2, r = De();
    if (!e) e = new Uint8Array(r), t2 = "Uint8Array";
    else {
      if (e.length < r) throw new TypeError("output buffer is too small");
      t2 = "number";
    }
    let n2 = new DataView(e.buffer, e.byteOffset, e.length), o3 = 0;
    n2.setUint32(o3, Zr, true), o3 += 4;
    let [i5] = mt(s), a4 = -Xr(Number(i5 % 2n ** 32n), 2 ** 32);
    n2.setInt32(o3, a4, true), o3 += 4, Ie(e, o3, R4, i5, true), o3 += R4;
    let c3 = 2n ** 4096n % i5;
    return Ie(e, o3, R4, c3, true), o3 += R4, n2.setUint32(o3, 65537, true), o3 += 4, t2 === "Uint8Array" ? e : r;
  }
  function Qr(s, e, t2) {
    if (t2 === 1n) return 0n;
    let r = 1n;
    for (s = s % t2; e > 0n; ) BigInt.asUintN(1, e) === 1n && (r = r * s % t2), s = s * s % t2, e >>= 1n;
    return r;
  }
  var ft = 20;
  var wt = 48;
  var Jr = 4;
  var es = 5;
  var ts = 6;
  var Ce = new Uint8Array([wt, 13 + ft, wt, 9, ts, 5, 43, 14, 3, 2, 26, es, 0, Jr, ft]);
  function bt(s, e) {
    let [t2, r] = mt(s), n2 = new Uint8Array(256), o3 = 0;
    n2[o3] = 0, o3 += 1, n2[o3] = 1, o3 += 1;
    let i5 = n2.length - Ce.length - e.length - 1;
    for (; o3 < i5; ) n2[o3] = 255, o3 += 1;
    n2[o3] = 0, o3 += 1, n2.set(Ce, o3), o3 += Ce.length, n2.set(e, o3);
    let a4 = Qr(Pe(n2, 0, n2.length), r, t2);
    return Ie(n2, 0, n2.length, a4, false), n2;
  }
  var p5 = { Auth: 1213486401, Close: 1163086915, Connect: 1314410051, Okay: 1497451343, Open: 1313165391, Write: 1163154007 };
  var _e7 = j2({ command: Bt, arg0: Bt, arg1: Bt, payloadLength: Bt, checksum: Bt, magic: Lt }, { littleEndian: true });
  var Ei = kt(_e7, { payload: S("payloadLength") });
  function oe(s) {
    return s.reduce((e, t2) => e + t2, 0);
  }
  var xt = class extends f4 {
    constructor() {
      let e = new Uint8Array(_e7.size);
      super({ transform: async (t2, r) => {
        await t2.tryConsume(async (n2) => {
          let o3 = n2;
          o3.payloadLength = o3.payload.length, _e7.serialize(o3, e), await p4.ReadableStream.enqueue(r, e), o3.payloadLength && await p4.ReadableStream.enqueue(r, o3.payload);
        });
      } });
    }
  };
  var ie = { Token: 1, Signature: 2, PublicKey: 3 };
  var hs = async function* (s, e) {
    for await (let t2 of s.iterateKeys()) {
      let r = await e();
      if (r.arg0 !== ie.Token) return;
      let n2 = bt(t2.buffer, r.payload);
      yield { command: p5.Auth, arg0: ie.Signature, arg1: 0, payload: n2 };
    }
  };
  var us = async function* (s, e) {
    if ((await e()).arg0 !== ie.Token) return;
    let r;
    for await (let c3 of s.iterateKeys()) {
      r = c3;
      break;
    }
    r || (r = await s.generateKey());
    let n2 = De(), [o3] = w(n2), i5 = r.name?.length ? G(r.name) : E, a4 = new Uint8Array(o3 + (i5.length ? i5.length + 1 : 0) + 1);
    yt(r.buffer, a4), O2(a4.subarray(0, n2), a4), i5.length && (a4[o3] = 32, a4.set(i5, o3 + 1)), yield { command: p5.Auth, arg0: ie.PublicKey, arg1: 0, payload: a4 };
  };
  var vt = [hs, us];
  var _e8, _t8, _r5, _s5, _ae_instances, n_fn, _a10;
  var ae = (_a10 = class {
    constructor(e, t2) {
      __privateAdd(this, _ae_instances);
      __publicField(this, "authenticators");
      __privateAdd(this, _e8);
      __privateAdd(this, _t8, new o());
      __privateAdd(this, _r5);
      __privateAdd(this, _s5, () => __privateGet(this, _t8).promise);
      this.authenticators = e, __privateSet(this, _e8, t2);
    }
    async process(e) {
      __privateGet(this, _r5) || __privateSet(this, _r5, __privateMethod(this, _ae_instances, n_fn).call(this)), __privateGet(this, _t8).resolve(e);
      let t2 = await __privateGet(this, _r5).next();
      if (t2.done) throw new Error("No authenticator can handle the request");
      return t2.value;
    }
    dispose() {
      __privateGet(this, _r5)?.return?.();
    }
  }, _e8 = new WeakMap(), _t8 = new WeakMap(), _r5 = new WeakMap(), _s5 = new WeakMap(), _ae_instances = new WeakSet(), n_fn = async function* () {
    for (let e of this.authenticators) for await (let t2 of e(__privateGet(this, _e8), __privateGet(this, _s5))) __privateSet(this, _t8, new o()), yield t2;
  }, _a10);
  var _e9, _t9, _r6, _s6, _n, _o, _a11, _c, _i, _L_instances, l_fn, _a12;
  var L4 = (_a12 = class {
    constructor(e) {
      __privateAdd(this, _L_instances);
      __privateAdd(this, _e9);
      __publicField(this, "localId");
      __publicField(this, "remoteId");
      __publicField(this, "localCreated");
      __publicField(this, "service");
      __privateAdd(this, _t9);
      __privateAdd(this, _r6);
      __privateAdd(this, _s6);
      __publicField(this, "writable");
      __privateAdd(this, _n, false);
      __privateAdd(this, _o, new o());
      __privateAdd(this, _a11);
      __privateAdd(this, _c);
      __privateAdd(this, _i, 0);
      __privateSet(this, _e9, e.dispatcher), this.localId = e.localId, this.remoteId = e.remoteId, this.localCreated = e.localCreated, this.service = e.service, __privateSet(this, _t9, new m3((t2) => {
        __privateSet(this, _r6, t2);
      })), this.writable = new maybe_consumable_exports.WritableStream({ start: (t2) => {
        __privateSet(this, _s6, t2), t2.signal.addEventListener("abort", () => {
          __privateGet(this, _c)?.reject(t2.signal.reason);
        });
      }, write: async (t2) => {
        let r = t2.length, n2 = __privateGet(this, _e9).options.maxPayloadSize;
        for (let o3 = 0, i5 = n2; o3 < r; o3 = i5, i5 += n2) {
          let a4 = t2.subarray(o3, i5);
          await __privateMethod(this, _L_instances, l_fn).call(this, a4);
        }
      } }), __privateSet(this, _a11, new Le(this)), __privateSet(this, _i, e.availableWriteBytes);
    }
    get readable() {
      return __privateGet(this, _t9);
    }
    get closed() {
      return __privateGet(this, _o).promise;
    }
    get socket() {
      return __privateGet(this, _a11);
    }
    async enqueue(e) {
      await __privateGet(this, _r6).enqueue(e);
    }
    ack(e) {
      __privateSet(this, _i, __privateGet(this, _i) + e), __privateGet(this, _c)?.resolve();
    }
    async close() {
      if (!__privateGet(this, _n)) {
        __privateSet(this, _n, true), __privateGet(this, _c)?.reject(new Error("Socket closed"));
        try {
          __privateGet(this, _s6).error(new Error("Socket closed"));
        } catch {
        }
        await __privateGet(this, _e9).sendPacket(p5.Close, this.localId, this.remoteId, E);
      }
    }
    dispose() {
      __privateGet(this, _r6).close(), __privateGet(this, _o).resolve(void 0);
    }
  }, _e9 = new WeakMap(), _t9 = new WeakMap(), _r6 = new WeakMap(), _s6 = new WeakMap(), _n = new WeakMap(), _o = new WeakMap(), _a11 = new WeakMap(), _c = new WeakMap(), _i = new WeakMap(), _L_instances = new WeakSet(), l_fn = async function(e) {
    let t2 = e.length;
    for (; __privateGet(this, _i) < t2; ) {
      let r = new o();
      __privateSet(this, _c, r), await r.promise;
    }
    __privateGet(this, _i) === 1 / 0 ? __privateSet(this, _i, -1) : __privateSet(this, _i, __privateGet(this, _i) - t2), await __privateGet(this, _e9).sendPacket(p5.Write, this.localId, this.remoteId, e);
  }, _a12);
  var _e10, _a13;
  var Le = (_a13 = class {
    constructor(e) {
      __privateAdd(this, _e10);
      __privateSet(this, _e10, e);
    }
    get localId() {
      return __privateGet(this, _e10).localId;
    }
    get remoteId() {
      return __privateGet(this, _e10).remoteId;
    }
    get localCreated() {
      return __privateGet(this, _e10).localCreated;
    }
    get service() {
      return __privateGet(this, _e10).service;
    }
    get readable() {
      return __privateGet(this, _e10).readable;
    }
    get writable() {
      return __privateGet(this, _e10).writable;
    }
    get closed() {
      return __privateGet(this, _e10).closed;
    }
    close() {
      return __privateGet(this, _e10).close();
    }
  }, _e10 = new WeakMap(), _a13);
  var _e11, _t10, _r7, _s7, _n2, _o2, _a14, _le_instances, c_fn, i_fn, l_fn2, h_fn, u_fn, d_fn, _a15;
  var le = (_a15 = class {
    constructor(e, t2) {
      __privateAdd(this, _le_instances);
      __privateAdd(this, _e11, new n(1));
      __privateAdd(this, _t10, /* @__PURE__ */ new Map());
      __privateAdd(this, _r7);
      __publicField(this, "options");
      __privateAdd(this, _s7, false);
      __privateAdd(this, _n2, new o());
      __privateAdd(this, _o2, /* @__PURE__ */ new Map());
      __privateAdd(this, _a14, new W());
      this.options = t2, this.options.initialDelayedAckBytes < 0 && (this.options.initialDelayedAckBytes = 0), e.readable.pipeTo(new l5({ write: async (r) => {
        switch (r.command) {
          case p5.Close:
            await __privateMethod(this, _le_instances, c_fn).call(this, r);
            break;
          case p5.Okay:
            __privateMethod(this, _le_instances, i_fn).call(this, r);
            break;
          case p5.Open:
            await __privateMethod(this, _le_instances, h_fn).call(this, r);
            break;
          case p5.Write:
            await __privateMethod(this, _le_instances, u_fn).call(this, r);
            break;
          default:
            throw new Error(`Unknown command: ${r.command.toString(16)}`);
        }
      } }), { preventCancel: t2.preserveConnection ?? false, signal: __privateGet(this, _a14).signal }).then(() => {
        __privateMethod(this, _le_instances, d_fn).call(this);
      }, (r) => {
        __privateGet(this, _s7) || __privateGet(this, _n2).reject(r), __privateMethod(this, _le_instances, d_fn).call(this);
      }), __privateSet(this, _r7, e.writable.getWriter());
    }
    get disconnected() {
      return __privateGet(this, _n2).promise;
    }
    async createSocket(e) {
      this.options.appendNullToServiceString && (e += "\0");
      let [t2, r] = __privateGet(this, _e11).add();
      await this.sendPacket(p5.Open, t2, this.options.initialDelayedAckBytes, e);
      let { remoteId: n2, availableWriteBytes: o3 } = await r, i5 = new L4({ dispatcher: this, localId: t2, remoteId: n2, localCreated: true, service: e, availableWriteBytes: o3 });
      return __privateGet(this, _t10).set(t2, i5), i5.socket;
    }
    addReverseTunnel(e, t2) {
      __privateGet(this, _o2).set(e, t2);
    }
    removeReverseTunnel(e) {
      __privateGet(this, _o2).delete(e);
    }
    clearReverseTunnels() {
      __privateGet(this, _o2).clear();
    }
    async sendPacket(e, t2, r, n2) {
      if (typeof n2 == "string" && (n2 = G(n2)), n2.length > this.options.maxPayloadSize) throw new TypeError("payload too large");
      await p4.WritableStream.write(__privateGet(this, _r7), { command: e, arg0: t2, arg1: r, payload: n2, checksum: this.options.calculateChecksum ? oe(n2) : 0, magic: e ^ 4294967295 });
    }
    async close() {
      await Promise.all(Array.from(__privateGet(this, _t10).values(), (e) => e.close())), __privateSet(this, _s7, true), __privateGet(this, _a14).abort(), this.options.preserveConnection ? __privateGet(this, _r7).releaseLock() : await __privateGet(this, _r7).close();
    }
  }, _e11 = new WeakMap(), _t10 = new WeakMap(), _r7 = new WeakMap(), _s7 = new WeakMap(), _n2 = new WeakMap(), _o2 = new WeakMap(), _a14 = new WeakMap(), _le_instances = new WeakSet(), c_fn = async function(e) {
    if (e.arg0 === 0 && __privateGet(this, _e11).reject(e.arg1, new Error("Socket open failed"))) return;
    let t2 = __privateGet(this, _t10).get(e.arg1);
    if (t2) {
      await t2.close(), t2.dispose(), __privateGet(this, _t10).delete(e.arg1);
      return;
    }
  }, i_fn = function(e) {
    let t2;
    if (this.options.initialDelayedAckBytes !== 0) {
      if (e.payload.length !== 4) throw new Error("Invalid OKAY packet. Payload size should be 4");
      t2 = R(e.payload, 0);
    } else {
      if (e.payload.length !== 0) throw new Error("Invalid OKAY packet. Payload size should be 0");
      t2 = 1 / 0;
    }
    if (__privateGet(this, _e11).resolve(e.arg1, { remoteId: e.arg0, availableWriteBytes: t2 })) return;
    let r = __privateGet(this, _t10).get(e.arg1);
    if (r) {
      r.ack(t2);
      return;
    }
    this.sendPacket(p5.Close, e.arg1, e.arg0, E);
  }, l_fn2 = function(e, t2, r) {
    let n2;
    return this.options.initialDelayedAckBytes !== 0 ? (n2 = new Uint8Array(4), V(n2, 0, r)) : n2 = E, this.sendPacket(p5.Okay, e, t2, n2);
  }, h_fn = async function(e) {
    let [t2] = __privateGet(this, _e11).add();
    __privateGet(this, _e11).resolve(t2, void 0);
    let r = e.arg0, n2 = e.arg1, o3 = H(e.payload);
    if (o3.endsWith("\0") && (o3 = o3.substring(0, o3.length - 1)), this.options.initialDelayedAckBytes === 0) {
      if (n2 !== 0) throw new Error("Invalid OPEN packet. arg1 should be 0");
      n2 = 1 / 0;
    } else if (n2 === 0) throw new Error("Invalid OPEN packet. arg1 should be greater than 0");
    let i5 = __privateGet(this, _o2).get(o3);
    if (!i5) {
      await this.sendPacket(p5.Close, 0, r, E);
      return;
    }
    let a4 = new L4({ dispatcher: this, localId: t2, remoteId: r, localCreated: false, service: o3, availableWriteBytes: n2 });
    try {
      await i5(a4.socket), __privateGet(this, _t10).set(t2, a4), await __privateMethod(this, _le_instances, l_fn2).call(this, t2, r, this.options.initialDelayedAckBytes);
    } catch {
      await this.sendPacket(p5.Close, 0, r, E);
    }
  }, u_fn = async function(e) {
    let t2 = __privateGet(this, _t10).get(e.arg1);
    if (!t2) throw new Error(`Unknown local socket id: ${e.arg1}`);
    let r = false, n2 = [(async () => {
      await t2.enqueue(e.payload), await __privateMethod(this, _le_instances, l_fn2).call(this, e.arg1, e.arg0, e.payload.length), r = true;
    })()];
    this.options.readTimeLimit && n2.push((async () => {
      if (await h(this.options.readTimeLimit), !r) throw new Error(`readable of \`${t2.service}\` has stalled for ${this.options.readTimeLimit} milliseconds`);
    })()), await Promise.race(n2);
  }, d_fn = function() {
    for (let e of __privateGet(this, _t10).values()) e.dispose();
    __privateGet(this, _n2).resolve();
  }, _a15);
  var _s8 = 16777217;
  var kt2 = [l6.ShellV2, l6.Cmd, l6.StatV2, l6.ListV2, l6.FixedPushMkdir, "apex", l6.Abb, "fixed_push_symlink_timestamp", l6.AbbExec, "remount_shell", "track_app", l6.SendReceiveV2, "sendrecv_v2_brotli", "sendrecv_v2_lz4", "sendrecv_v2_zstd", "sendrecv_v2_dry_run_send", l6.DelayedAck];
  var Ls = 32 * 1024 * 1024;
  var _e12, _t11, _r8, _s9, _n3, _o3, _a16;
  var At = (_a16 = class {
    constructor({ serial: e, connection: t2, version: r, banner: n2, features: o3 = kt2, initialDelayedAckBytes: i5, ...a4 }) {
      __privateAdd(this, _e12);
      __privateAdd(this, _t11);
      __privateAdd(this, _r8);
      __privateAdd(this, _s9);
      __privateAdd(this, _n3);
      __privateAdd(this, _o3);
      if (__privateSet(this, _r8, e), __privateSet(this, _e12, t2), __privateSet(this, _n3, I.parse(n2)), __privateSet(this, _o3, o3), o3.includes(l6.DelayedAck)) {
        if (i5 <= 0) throw new TypeError("`initialDelayedAckBytes` must be greater than 0 when DelayedAck feature is enabled.");
        __privateGet(this, _n3).features.includes(l6.DelayedAck) || (i5 = 0);
      } else i5 = 0;
      let c3, h4;
      r >= _s8 ? (c3 = false, h4 = false) : (c3 = true, h4 = true), __privateSet(this, _t11, new le(t2, { calculateChecksum: c3, appendNullToServiceString: h4, initialDelayedAckBytes: i5, ...a4 })), __privateSet(this, _s9, r);
    }
    static async authenticate({ serial: e, connection: t2, credentialStore: r, authenticators: n2 = vt, features: o3 = kt2, initialDelayedAckBytes: i5 = Ls, ...a4 }) {
      let c3 = 16777217, h4 = 1024 * 1024, f6 = new o(), b5 = new ae(n2, r), x5 = new W(), me = t2.readable.pipeTo(new l5({ async write(w4) {
        switch (w4.command) {
          case p5.Connect:
            c3 = Math.min(c3, w4.arg0), h4 = Math.min(h4, w4.arg1), f6.resolve(H(w4.payload));
            break;
          case p5.Auth: {
            let Dt2 = await b5.process(w4);
            await Ne(Dt2);
            break;
          }
          default:
            break;
        }
      } }), { preventCancel: true, signal: x5.signal }).then(() => {
        f6.reject(new Error("Connection closed unexpectedly"));
      }, (w4) => {
        f6.reject(w4);
      }), k2 = t2.writable.getWriter();
      async function Ne(w4) {
        w4.checksum = oe(w4.payload), w4.magic = w4.command ^ 4294967295, await p4.WritableStream.write(k2, w4);
      }
      let ye = o3.slice();
      if (i5 <= 0) {
        let w4 = o3.indexOf(l6.DelayedAck);
        w4 !== -1 && ye.splice(w4, 1);
      }
      let ze;
      try {
        await Ne({ command: p5.Connect, arg0: c3, arg1: h4, payload: G(`host::features=${ye.join(",")}`) }), ze = await f6.promise;
      } finally {
        x5.abort(), k2.releaseLock(), await me;
      }
      return new _a16({ serial: e, connection: t2, version: c3, maxPayloadSize: h4, banner: ze, features: ye, initialDelayedAckBytes: i5, ...a4 });
    }
    get connection() {
      return __privateGet(this, _e12);
    }
    get serial() {
      return __privateGet(this, _r8);
    }
    get protocolVersion() {
      return __privateGet(this, _s9);
    }
    get maxPayloadSize() {
      return __privateGet(this, _t11).options.maxPayloadSize;
    }
    get banner() {
      return __privateGet(this, _n3);
    }
    get disconnected() {
      return __privateGet(this, _t11).disconnected;
    }
    get clientFeatures() {
      return __privateGet(this, _o3);
    }
    connect(e) {
      return __privateGet(this, _t11).createSocket(e);
    }
    addReverseTunnel(e, t2) {
      return t2 || (t2 = `localabstract:reverse_${Math.random().toString().substring(2)}`), __privateGet(this, _t11).addReverseTunnel(t2, e), t2;
    }
    removeReverseTunnel(e) {
      __privateGet(this, _t11).removeReverseTunnel(e);
    }
    clearReverseTunnels() {
      __privateGet(this, _t11).clearReverseTunnels();
    }
    close() {
      return __privateGet(this, _t11).close();
    }
  }, _e12 = new WeakMap(), _t11 = new WeakMap(), _r8 = new WeakMap(), _s9 = new WeakMap(), _n3 = new WeakMap(), _o3 = new WeakMap(), _a16);
  var $s = G("OKAY");
  var Ue = G("FAIL");
  function Pt2(s, e) {
    e < 0 || e >= s.length || (s[e] = s[s.length - 1], s.length -= 1);
  }
  var Gs = [l6.ShellV2, l6.Cmd, l6.StatV2, l6.ListV2, l6.FixedPushMkdir, "apex", l6.Abb, "fixed_push_symlink_timestamp", l6.AbbExec, "remount_shell", "track_app", l6.SendReceiveV2, "sendrecv_v2_brotli", "sendrecv_v2_lz4", "sendrecv_v2_zstd", "sendrecv_v2_dry_run_send"];

  // http-url:https://esm.sh/@yume-chan/adb-daemon-webusb@2.1.0/es2022/adb-daemon-webusb.mjs
  var h3 = class extends Error {
    constructor(e) {
      super("The device is already in used by another program", { cause: e });
    }
  };
  function f5(r, e) {
    return typeof r == "object" && r !== null && "name" in r && r.name === e;
  }
  function I2(r) {
    return r.classCode !== void 0 && r.subclassCode !== void 0 && r.protocolCode !== void 0;
  }
  function D2(r, e) {
    return r.interfaceClass === e.classCode && r.interfaceSubclass === e.subclassCode && r.interfaceProtocol === e.protocolCode;
  }
  function F3(r, e) {
    for (let t2 of r.configurations) for (let n2 of t2.interfaces) for (let i5 of n2.alternates) if (D2(i5, e)) return { configuration: t2, interface_: n2, alternate: i5 };
  }
  function y7(r) {
    return r.toString(16).padStart(4, "0");
  }
  function w3(r) {
    return r.serialNumber ? r.serialNumber : y7(r.vendorId) + "x" + y7(r.productId);
  }
  function x4(r) {
    if (r.length === 0) throw new TypeError("No endpoints given");
    let e, t2;
    for (let n2 of r) switch (n2.direction) {
      case "in":
        if (e = n2, t2) return { inEndpoint: e, outEndpoint: t2 };
        break;
      case "out":
        if (t2 = n2, e) return { inEndpoint: e, outEndpoint: t2 };
        break;
    }
    throw e ? t2 ? new Error("unreachable") : new TypeError("No output endpoint found.") : new TypeError("No input endpoint found.");
  }
  function S3(r, e) {
    return e.vendorId !== void 0 && r.vendorId !== e.vendorId || e.productId !== void 0 && r.productId !== e.productId || e.serialNumber !== void 0 && w3(r) !== e.serialNumber ? false : I2(e) ? F3(r, e) || false : true;
  }
  function u4(r, e, t2) {
    if (t2 && t2.length > 0 && u4(r, t2)) return false;
    for (let n2 of e) {
      let i5 = S3(r, n2);
      if (i5) return i5;
    }
    return false;
  }
  var p6 = { classCode: 255, subclassCode: 66, protocolCode: 1 };
  function d4(r) {
    return !r || r.length === 0 ? [p6] : r.map((e) => ({ ...e, classCode: e.classCode ?? p6.classCode, subclassCode: e.subclassCode ?? p6.subclassCode, protocolCode: e.protocolCode ?? p6.protocolCode }));
  }
  var _t12, _r9, _e13, _n4, _i2, _b_instances, s_fn, _a17;
  var b4 = (_a17 = class {
    constructor(e, t2, n2, i5) {
      __privateAdd(this, _b_instances);
      __privateAdd(this, _t12);
      __privateAdd(this, _r9);
      __privateAdd(this, _e13);
      __privateAdd(this, _n4);
      __privateAdd(this, _i2);
      __privateSet(this, _t12, e), __privateSet(this, _r9, t2), __privateSet(this, _e13, n2);
      let s = false, c3 = new L2({ close: async () => {
        try {
          s = true, await e.raw.close();
        } catch {
        }
      }, dispose: () => {
        s = true, i5.removeEventListener("disconnect", g2);
      } });
      function g2(o3) {
        o3.device === e.raw && c3.dispose().catch(N);
      }
      i5.addEventListener("disconnect", g2), __privateSet(this, _n4, c3.wrapReadable(new u2({ pull: async (o3) => {
        let l8 = await __privateMethod(this, _b_instances, s_fn).call(this);
        l8 ? o3.enqueue(l8) : o3.close();
      } }, { highWaterMark: 0 })));
      let v2 = n2.packetSize - 1;
      __privateSet(this, _i2, tt2(c3.createWritable(new maybe_consumable_exports.WritableStream({ write: async (o3) => {
        try {
          await e.raw.transferOut(n2.endpointNumber, o3), v2 && (o3.length & v2) === 0 && await e.raw.transferOut(n2.endpointNumber, E);
        } catch (l8) {
          if (s) return;
          throw l8;
        }
      } })), new xt()));
    }
    get device() {
      return __privateGet(this, _t12);
    }
    get inEndpoint() {
      return __privateGet(this, _r9);
    }
    get outEndpoint() {
      return __privateGet(this, _e13);
    }
    get readable() {
      return __privateGet(this, _n4);
    }
    get writable() {
      return __privateGet(this, _i2);
    }
  }, _t12 = new WeakMap(), _r9 = new WeakMap(), _e13 = new WeakMap(), _n4 = new WeakMap(), _i2 = new WeakMap(), _b_instances = new WeakSet(), s_fn = async function() {
    try {
      for (; ; ) {
        let e = await __privateGet(this, _t12).raw.transferIn(__privateGet(this, _r9).endpointNumber, __privateGet(this, _r9).packetSize);
        if (e.data.byteLength !== 24) continue;
        let t2 = new Uint8Array(e.data.buffer), n2 = new q(t2), i5 = _e7.deserialize(n2);
        if (i5.magic === (i5.command ^ 4294967295)) {
          if (i5.payloadLength !== 0) {
            let s = await __privateGet(this, _t12).raw.transferIn(__privateGet(this, _r9).endpointNumber, i5.payloadLength);
            i5.payload = new Uint8Array(s.data.buffer);
          } else i5.payload = E;
          return i5;
        }
      }
    } catch (e) {
      if (f5(e, "NetworkError") && (await new Promise((t2) => {
        setTimeout(() => {
          t2();
        }, 100);
      }), closed)) return;
      throw e;
    }
  }, _a17);
  var _a18, _t13, _r10, _e14, _n5, _r_instances, i_fn2;
  var a3 = (_a18 = class {
    constructor(e, t2, n2) {
      __privateAdd(this, _r_instances);
      __privateAdd(this, _t13);
      __privateAdd(this, _r10);
      __privateAdd(this, _e14);
      __privateAdd(this, _n5);
      __privateSet(this, _e14, e), __privateSet(this, _n5, w3(e)), __privateSet(this, _t13, t2), __privateSet(this, _r10, n2);
    }
    get raw() {
      return __privateGet(this, _e14);
    }
    get serial() {
      return __privateGet(this, _n5);
    }
    get name() {
      return __privateGet(this, _e14).productName;
    }
    async connect() {
      let { inEndpoint: e, outEndpoint: t2 } = await __privateMethod(this, _r_instances, i_fn2).call(this);
      return new b4(this, e, t2, __privateGet(this, _r10));
    }
  }, _t13 = new WeakMap(), _r10 = new WeakMap(), _e14 = new WeakMap(), _n5 = new WeakMap(), _r_instances = new WeakSet(), i_fn2 = async function() {
    __privateGet(this, _e14).opened || await __privateGet(this, _e14).open();
    let { configuration: e, interface_: t2, alternate: n2 } = __privateGet(this, _t13);
    if (__privateGet(this, _e14).configuration?.configurationValue !== e.configurationValue && await __privateGet(this, _e14).selectConfiguration(e.configurationValue), !t2.claimed) try {
      await __privateGet(this, _e14).claimInterface(t2.interfaceNumber);
    } catch (i5) {
      throw f5(i5, "NetworkError") ? new _a18.DeviceBusyError(i5) : i5;
    }
    return t2.alternate.alternateSetting !== n2.alternateSetting && await __privateGet(this, _e14).selectAlternateInterface(t2.interfaceNumber, n2.alternateSetting), x4(n2.endpoints);
  }, __publicField(_a18, "DeviceBusyError", h3), _a18);
  var _t14, _r11, _e15, _n6, _i3, _s10, _r_instances2, o_fn, _a20, _c2, _a19;
  var m5 = (_a19 = class {
    constructor(e, t2, n2 = {}) {
      __privateAdd(this, _r_instances2);
      __privateAdd(this, _t14);
      __privateAdd(this, _r11);
      __privateAdd(this, _e15);
      __privateAdd(this, _n6, new i2());
      __publicField(this, "onDeviceAdd", __privateGet(this, _n6).event);
      __privateAdd(this, _i3, new i2());
      __publicField(this, "onDeviceRemove", __privateGet(this, _i3).event);
      __privateAdd(this, _s10, new l3());
      __publicField(this, "onListChange", __privateGet(this, _s10).event);
      __publicField(this, "current", []);
      __privateAdd(this, _a20, (e) => {
        let t2 = __privateMethod(this, _r_instances2, o_fn).call(this, e.device);
        if (!t2) return;
        let n2 = this.current.slice();
        n2.push(t2), this.current = n2, __privateGet(this, _n6).fire([t2]), __privateGet(this, _s10).fire(this.current);
      });
      __privateAdd(this, _c2, (e) => {
        let t2 = this.current.findIndex((n2) => n2.raw === e.device);
        if (t2 !== -1) {
          let n2 = this.current[t2], i5 = this.current.slice();
          Pt2(i5, t2), this.current = i5, __privateGet(this, _i3).fire([n2]), __privateGet(this, _s10).fire(this.current);
        }
      });
      __privateSet(this, _t14, d4(n2.filters)), __privateSet(this, _r11, n2.exclusionFilters), __privateSet(this, _e15, e), this.current = t2.map((i5) => __privateMethod(this, _r_instances2, o_fn).call(this, i5)).filter((i5) => !!i5), __privateGet(this, _s10).fire(this.current), __privateGet(this, _e15).addEventListener("connect", __privateGet(this, _a20)), __privateGet(this, _e15).addEventListener("disconnect", __privateGet(this, _c2));
    }
    static async create(e, t2 = {}) {
      let n2 = await e.getDevices();
      return new _a19(e, n2, t2);
    }
    stop() {
      __privateGet(this, _e15).removeEventListener("connect", __privateGet(this, _a20)), __privateGet(this, _e15).removeEventListener("disconnect", __privateGet(this, _c2)), __privateGet(this, _n6).dispose(), __privateGet(this, _i3).dispose(), __privateGet(this, _s10).dispose();
    }
  }, _t14 = new WeakMap(), _r11 = new WeakMap(), _e15 = new WeakMap(), _n6 = new WeakMap(), _i3 = new WeakMap(), _s10 = new WeakMap(), _r_instances2 = new WeakSet(), o_fn = function(e) {
    let t2 = u4(e, __privateGet(this, _t14), __privateGet(this, _r11));
    if (t2) return new a3(e, t2, __privateGet(this, _e15));
  }, _a20 = new WeakMap(), _c2 = new WeakMap(), _a19);
  var _a21, _t15;
  var N2 = (_a21 = class {
    constructor(e) {
      __privateAdd(this, _t15);
      __privateSet(this, _t15, e);
    }
    async requestDevice(e = {}) {
      let t2 = d4(e.filters);
      try {
        let n2 = await __privateGet(this, _t15).requestDevice({ filters: t2, exclusionFilters: e.exclusionFilters }), i5 = u4(n2, t2, e.exclusionFilters);
        return i5 ? new a3(n2, i5, __privateGet(this, _t15)) : void 0;
      } catch (n2) {
        if (f5(n2, "NotFoundError")) return;
        throw n2;
      }
    }
    async getDevices(e = {}) {
      let t2 = d4(e.filters), n2 = await __privateGet(this, _t15).getDevices(), i5 = [];
      for (let s of n2) {
        let c3 = u4(s, t2, e.exclusionFilters);
        c3 && i5.push(new a3(s, c3, __privateGet(this, _t15)));
      }
      return i5;
    }
    trackDevices(e = {}) {
      return m5.create(__privateGet(this, _t15), e);
    }
  }, _t15 = new WeakMap(), __publicField(_a21, "BROWSER", typeof globalThis.navigator < "u" && globalThis.navigator.usb ? new _a21(globalThis.navigator.usb) : void 0), _a21);

  // http-url:https://esm.sh/@yume-chan/adb-credential-web@2.1.0/es2022/adb-credential-web.mjs
  function i4() {
    return new Promise((n2, t2) => {
      let e = indexedDB.open("Tango", 1);
      e.onerror = () => {
        t2(e.error);
      }, e.onupgradeneeded = () => {
        e.result.createObjectStore("Authentication", { autoIncrement: true });
      }, e.onsuccess = () => {
        let o3 = e.result;
        n2(o3);
      };
    });
  }
  async function u5(n2) {
    let t2 = await i4();
    return new Promise((e, o3) => {
      let r = t2.transaction("Authentication", "readwrite"), a4 = r.objectStore("Authentication").add(n2);
      a4.onerror = () => {
        o3(a4.error);
      }, a4.onsuccess = () => {
        e();
      }, r.onerror = () => {
        o3(r.error);
      }, r.oncomplete = () => {
        t2.close();
      };
    });
  }
  async function l7() {
    let n2 = await i4();
    return new Promise((t2, e) => {
      let o3 = n2.transaction("Authentication", "readonly"), s = o3.objectStore("Authentication").getAll();
      s.onerror = () => {
        e(s.error);
      }, s.onsuccess = () => {
        t2(s.result);
      }, o3.onerror = () => {
        e(o3.error);
      }, o3.oncomplete = () => {
        n2.close();
      };
    });
  }
  var _e16, _a22;
  var c2 = (_a22 = class {
    constructor(t2 = "Tango") {
      __privateAdd(this, _e16);
      __privateSet(this, _e16, t2);
    }
    async generateKey() {
      let { privateKey: t2 } = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-1" }, true, ["sign", "verify"]), e = new Uint8Array(await crypto.subtle.exportKey("pkcs8", t2));
      return await u5(e), { buffer: e, name: `${__privateGet(this, _e16)}@${globalThis.location.hostname}` };
    }
    async *iterateKeys() {
      for (let t2 of await l7()) yield { buffer: t2, name: `${__privateGet(this, _e16)}@${globalThis.location.hostname}` };
    }
  }, _e16 = new WeakMap(), _a22);

  // entry.js
  async function connectAdb() {
    const manager = new N2();
    const device = await manager.requestDevice();
    const connection = await device.connect();
    const transport = await At.authenticate({
      serial: device.serial,
      connection,
      credentialStore: new c2("LocalADB")
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
        let output = "";
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
      banner: transport.banner
    };
  }
  window.WebADB = { connectAdb };
})();
