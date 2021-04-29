
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign$1(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign$1($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    var _listCacheClear = listCacheClear;

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    var eq_1 = eq;

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq_1(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    var _assocIndexOf = assocIndexOf;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    var _listCacheDelete = listCacheDelete;

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    var _listCacheGet = listCacheGet;

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return _assocIndexOf(this.__data__, key) > -1;
    }

    var _listCacheHas = listCacheHas;

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    var _listCacheSet = listCacheSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = _listCacheClear;
    ListCache.prototype['delete'] = _listCacheDelete;
    ListCache.prototype.get = _listCacheGet;
    ListCache.prototype.has = _listCacheHas;
    ListCache.prototype.set = _listCacheSet;

    var _ListCache = ListCache;

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new _ListCache;
      this.size = 0;
    }

    var _stackClear = stackClear;

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    var _stackDelete = stackDelete;

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    var _stackGet = stackGet;

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    var _stackHas = stackHas;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    function commonjsRequire (target) {
    	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
    }

    /** Detect free variable `global` from Node.js. */

    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = _freeGlobal || freeSelf || Function('return this')();

    var _root = root;

    /** Built-in value references. */
    var Symbol$1 = _root.Symbol;

    var _Symbol = Symbol$1;

    /** Used for built-in method references. */
    var objectProto$c = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$c.toString;

    /** Built-in value references. */
    var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty$9.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    var _getRawTag = getRawTag;

    /** Used for built-in method references. */
    var objectProto$b = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto$b.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    var _objectToString = objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? _getRawTag(value)
        : _objectToString(value);
    }

    var _baseGetTag = baseGetTag;

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject;

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag$2 = '[object Function]',
        genTag$1 = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject_1(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = _baseGetTag(value);
      return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
    }

    var isFunction_1 = isFunction;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = _root['__core-js_shared__'];

    var _coreJsData = coreJsData;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    var _isMasked = isMasked;

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString$1.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    var _toSource = toSource;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto$a = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty$8).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject_1(value) || _isMasked(value)) {
        return false;
      }
      var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
      return pattern.test(_toSource(value));
    }

    var _baseIsNative = baseIsNative;

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    var _getValue = getValue;

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = _getValue(object, key);
      return _baseIsNative(value) ? value : undefined;
    }

    var _getNative = getNative;

    /* Built-in method references that are verified to be native. */
    var Map$1 = _getNative(_root, 'Map');

    var _Map = Map$1;

    /* Built-in method references that are verified to be native. */
    var nativeCreate = _getNative(Object, 'create');

    var _nativeCreate = nativeCreate;

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
      this.size = 0;
    }

    var _hashClear = hashClear;

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    var _hashDelete = hashDelete;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$9 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (_nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED$1 ? undefined : result;
      }
      return hasOwnProperty$7.call(data, key) ? data[key] : undefined;
    }

    var _hashGet = hashGet;

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$6.call(data, key);
    }

    var _hashHas = hashHas;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    var _hashSet = hashSet;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = _hashClear;
    Hash.prototype['delete'] = _hashDelete;
    Hash.prototype.get = _hashGet;
    Hash.prototype.has = _hashHas;
    Hash.prototype.set = _hashSet;

    var _Hash = Hash;

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new _Hash,
        'map': new (_Map || _ListCache),
        'string': new _Hash
      };
    }

    var _mapCacheClear = mapCacheClear;

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    var _isKeyable = isKeyable;

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return _isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    var _getMapData = getMapData;

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = _getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    var _mapCacheDelete = mapCacheDelete;

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return _getMapData(this, key).get(key);
    }

    var _mapCacheGet = mapCacheGet;

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return _getMapData(this, key).has(key);
    }

    var _mapCacheHas = mapCacheHas;

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = _getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    var _mapCacheSet = mapCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = _mapCacheClear;
    MapCache.prototype['delete'] = _mapCacheDelete;
    MapCache.prototype.get = _mapCacheGet;
    MapCache.prototype.has = _mapCacheHas;
    MapCache.prototype.set = _mapCacheSet;

    var _MapCache = MapCache;

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof _ListCache) {
        var pairs = data.__data__;
        if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new _MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    var _stackSet = stackSet;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new _ListCache(entries);
      this.size = data.size;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = _stackClear;
    Stack.prototype['delete'] = _stackDelete;
    Stack.prototype.get = _stackGet;
    Stack.prototype.has = _stackHas;
    Stack.prototype.set = _stackSet;

    var _Stack = Stack;

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    var _arrayEach = arrayEach;

    var defineProperty = (function() {
      try {
        var func = _getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    var _defineProperty = defineProperty;

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && _defineProperty) {
        _defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    var _baseAssignValue = baseAssignValue;

    /** Used for built-in method references. */
    var objectProto$7 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty$5.call(object, key) && eq_1(objValue, value)) ||
          (value === undefined && !(key in object))) {
        _baseAssignValue(object, key, value);
      }
    }

    var _assignValue = assignValue;

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          _baseAssignValue(object, key, newValue);
        } else {
          _assignValue(object, key, newValue);
        }
      }
      return object;
    }

    var _copyObject = copyObject;

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    var _baseTimes = baseTimes;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike;

    /** `Object#toString` result references. */
    var argsTag$2 = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike_1(value) && _baseGetTag(value) == argsTag$2;
    }

    var _baseIsArguments = baseIsArguments;

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
      return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
        !propertyIsEnumerable$1.call(value, 'callee');
    };

    var isArguments_1 = isArguments;

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    var isArray_1 = isArray;

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    var stubFalse_1 = stubFalse;

    var isBuffer_1 = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? _root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse_1;

    module.exports = isBuffer;
    });

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER$1 : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    var _isIndex = isIndex;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    var isLength_1 = isLength;

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]',
        arrayTag$1 = '[object Array]',
        boolTag$2 = '[object Boolean]',
        dateTag$2 = '[object Date]',
        errorTag$1 = '[object Error]',
        funcTag$1 = '[object Function]',
        mapTag$4 = '[object Map]',
        numberTag$2 = '[object Number]',
        objectTag$2 = '[object Object]',
        regexpTag$2 = '[object RegExp]',
        setTag$4 = '[object Set]',
        stringTag$2 = '[object String]',
        weakMapTag$2 = '[object WeakMap]';

    var arrayBufferTag$2 = '[object ArrayBuffer]',
        dataViewTag$3 = '[object DataView]',
        float32Tag$2 = '[object Float32Array]',
        float64Tag$2 = '[object Float64Array]',
        int8Tag$2 = '[object Int8Array]',
        int16Tag$2 = '[object Int16Array]',
        int32Tag$2 = '[object Int32Array]',
        uint8Tag$2 = '[object Uint8Array]',
        uint8ClampedTag$2 = '[object Uint8ClampedArray]',
        uint16Tag$2 = '[object Uint16Array]',
        uint32Tag$2 = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] =
    typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] =
    typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] =
    typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] =
    typedArrayTags[uint32Tag$2] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
    typedArrayTags[arrayBufferTag$2] = typedArrayTags[boolTag$2] =
    typedArrayTags[dataViewTag$3] = typedArrayTags[dateTag$2] =
    typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
    typedArrayTags[mapTag$4] = typedArrayTags[numberTag$2] =
    typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$2] =
    typedArrayTags[setTag$4] = typedArrayTags[stringTag$2] =
    typedArrayTags[weakMapTag$2] = false;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike_1(value) &&
        isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
    }

    var _baseIsTypedArray = baseIsTypedArray;

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    var _baseUnary = baseUnary;

    var _nodeUtil = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && _freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    module.exports = nodeUtil;
    });

    /* Node.js helper references. */
    var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

    var isTypedArray_1 = isTypedArray;

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray_1(value),
          isArg = !isArr && isArguments_1(value),
          isBuff = !isArr && !isArg && isBuffer_1(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? _baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty$3.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               _isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    var _arrayLikeKeys = arrayLikeKeys;

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

      return value === proto;
    }

    var _isPrototype = isPrototype;

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    var _overArg = overArg;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys = _overArg(Object.keys, Object);

    var _nativeKeys = nativeKeys;

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!_isPrototype(object)) {
        return _nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty$2.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeys = baseKeys;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength_1(value.length) && !isFunction_1(value);
    }

    var isArrayLike_1 = isArrayLike;

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
    }

    var keys_1 = keys;

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && _copyObject(source, keys_1(source), object);
    }

    var _baseAssign = baseAssign;

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    var _nativeKeysIn = nativeKeysIn;

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject_1(object)) {
        return _nativeKeysIn(object);
      }
      var isProto = _isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty$1.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeysIn = baseKeysIn;

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
    }

    var keysIn_1 = keysIn;

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && _copyObject(source, keysIn_1(source), object);
    }

    var _baseAssignIn = baseAssignIn;

    var _cloneBuffer = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? _root.Buffer : undefined,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    module.exports = cloneBuffer;
    });

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    var _copyArray = copyArray;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    var _arrayFilter = arrayFilter;

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    var stubArray_1 = stubArray;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$1.propertyIsEnumerable;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return _arrayFilter(nativeGetSymbols$1(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    var _getSymbols = getSymbols;

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return _copyObject(source, _getSymbols(source), object);
    }

    var _copySymbols = copySymbols;

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    var _arrayPush = arrayPush;

    /** Built-in value references. */
    var getPrototype = _overArg(Object.getPrototypeOf, Object);

    var _getPrototype = getPrototype;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray_1 : function(object) {
      var result = [];
      while (object) {
        _arrayPush(result, _getSymbols(object));
        object = _getPrototype(object);
      }
      return result;
    };

    var _getSymbolsIn = getSymbolsIn;

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return _copyObject(source, _getSymbolsIn(source), object);
    }

    var _copySymbolsIn = copySymbolsIn;

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
    }

    var _baseGetAllKeys = baseGetAllKeys;

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return _baseGetAllKeys(object, keys_1, _getSymbols);
    }

    var _getAllKeys = getAllKeys;

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
    }

    var _getAllKeysIn = getAllKeysIn;

    /* Built-in method references that are verified to be native. */
    var DataView = _getNative(_root, 'DataView');

    var _DataView = DataView;

    /* Built-in method references that are verified to be native. */
    var Promise$1 = _getNative(_root, 'Promise');

    var _Promise = Promise$1;

    /* Built-in method references that are verified to be native. */
    var Set$1 = _getNative(_root, 'Set');

    var _Set = Set$1;

    /* Built-in method references that are verified to be native. */
    var WeakMap = _getNative(_root, 'WeakMap');

    var _WeakMap = WeakMap;

    /** `Object#toString` result references. */
    var mapTag$3 = '[object Map]',
        objectTag$1 = '[object Object]',
        promiseTag = '[object Promise]',
        setTag$3 = '[object Set]',
        weakMapTag$1 = '[object WeakMap]';

    var dataViewTag$2 = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = _toSource(_DataView),
        mapCtorString = _toSource(_Map),
        promiseCtorString = _toSource(_Promise),
        setCtorString = _toSource(_Set),
        weakMapCtorString = _toSource(_WeakMap);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = _baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
        (_Map && getTag(new _Map) != mapTag$3) ||
        (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
        (_Set && getTag(new _Set) != setTag$3) ||
        (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
      getTag = function(value) {
        var result = _baseGetTag(value),
            Ctor = result == objectTag$1 ? value.constructor : undefined,
            ctorString = Ctor ? _toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag$2;
            case mapCtorString: return mapTag$3;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag$3;
            case weakMapCtorString: return weakMapTag$1;
          }
        }
        return result;
      };
    }

    var _getTag = getTag;

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    var _initCloneArray = initCloneArray;

    /** Built-in value references. */
    var Uint8Array$1 = _root.Uint8Array;

    var _Uint8Array = Uint8Array$1;

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
      return result;
    }

    var _cloneArrayBuffer = cloneArrayBuffer;

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    var _cloneDataView = cloneDataView;

    /** Used to match `RegExp` flags from their coerced string values. */
    var reFlags = /\w*$/;

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    var _cloneRegExp = cloneRegExp;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = _Symbol ? _Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    var _cloneSymbol = cloneSymbol;

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    var _cloneTypedArray = cloneTypedArray;

    /** `Object#toString` result references. */
    var boolTag$1 = '[object Boolean]',
        dateTag$1 = '[object Date]',
        mapTag$2 = '[object Map]',
        numberTag$1 = '[object Number]',
        regexpTag$1 = '[object RegExp]',
        setTag$2 = '[object Set]',
        stringTag$1 = '[object String]',
        symbolTag$1 = '[object Symbol]';

    var arrayBufferTag$1 = '[object ArrayBuffer]',
        dataViewTag$1 = '[object DataView]',
        float32Tag$1 = '[object Float32Array]',
        float64Tag$1 = '[object Float64Array]',
        int8Tag$1 = '[object Int8Array]',
        int16Tag$1 = '[object Int16Array]',
        int32Tag$1 = '[object Int32Array]',
        uint8Tag$1 = '[object Uint8Array]',
        uint8ClampedTag$1 = '[object Uint8ClampedArray]',
        uint16Tag$1 = '[object Uint16Array]',
        uint32Tag$1 = '[object Uint32Array]';

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag$1:
          return _cloneArrayBuffer(object);

        case boolTag$1:
        case dateTag$1:
          return new Ctor(+object);

        case dataViewTag$1:
          return _cloneDataView(object, isDeep);

        case float32Tag$1: case float64Tag$1:
        case int8Tag$1: case int16Tag$1: case int32Tag$1:
        case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
          return _cloneTypedArray(object, isDeep);

        case mapTag$2:
          return new Ctor;

        case numberTag$1:
        case stringTag$1:
          return new Ctor(object);

        case regexpTag$1:
          return _cloneRegExp(object);

        case setTag$2:
          return new Ctor;

        case symbolTag$1:
          return _cloneSymbol(object);
      }
    }

    var _initCloneByTag = initCloneByTag;

    /** Built-in value references. */
    var objectCreate = Object.create;

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject_1(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    var _baseCreate = baseCreate;

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !_isPrototype(object))
        ? _baseCreate(_getPrototype(object))
        : {};
    }

    var _initCloneObject = initCloneObject;

    /** `Object#toString` result references. */
    var mapTag$1 = '[object Map]';

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike_1(value) && _getTag(value) == mapTag$1;
    }

    var _baseIsMap = baseIsMap;

    /* Node.js helper references. */
    var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

    var isMap_1 = isMap;

    /** `Object#toString` result references. */
    var setTag$1 = '[object Set]';

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike_1(value) && _getTag(value) == setTag$1;
    }

    var _baseIsSet = baseIsSet;

    /* Node.js helper references. */
    var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

    var isSet_1 = isSet;

    /** Used to compose bitmasks for cloning. */
    var CLONE_DEEP_FLAG$1 = 1,
        CLONE_FLAT_FLAG = 2,
        CLONE_SYMBOLS_FLAG$1 = 4;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values supported by `_.clone`. */
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] =
    cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
    cloneableTags[boolTag] = cloneableTags[dateTag] =
    cloneableTags[float32Tag] = cloneableTags[float64Tag] =
    cloneableTags[int8Tag] = cloneableTags[int16Tag] =
    cloneableTags[int32Tag] = cloneableTags[mapTag] =
    cloneableTags[numberTag] = cloneableTags[objectTag] =
    cloneableTags[regexpTag] = cloneableTags[setTag] =
    cloneableTags[stringTag] = cloneableTags[symbolTag] =
    cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
    cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] =
    cloneableTags[weakMapTag] = false;

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG$1,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG$1;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject_1(value)) {
        return value;
      }
      var isArr = isArray_1(value);
      if (isArr) {
        result = _initCloneArray(value);
        if (!isDeep) {
          return _copyArray(value, result);
        }
      } else {
        var tag = _getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer_1(value)) {
          return _cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : _initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? _copySymbolsIn(value, _baseAssignIn(result, value))
              : _copySymbols(value, _baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = _initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new _Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet_1(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap_1(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? _getAllKeysIn : _getAllKeys)
        : (isFlat ? keysIn_1 : keys_1);

      var props = isArr ? undefined : keysFunc(value);
      _arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    var _baseClone = baseClone;

    /** Used to compose bitmasks for cloning. */
    var CLONE_DEEP_FLAG = 1,
        CLONE_SYMBOLS_FLAG = 4;

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return _baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    var cloneDeep_1 = cloneDeep;

    const assign = (target, source) => {
      return Object.assign(cloneDeep_1(target), cloneDeep_1(source));
    };

    const getStoreKey = (store, key) => {
      const storeState = getStoreState(store);
      return storeState[key];
    };

    const getStoreState = (store) => {
      let storeStateObj;
      const unsubscribe = store.subscribe((storeState) => {
        if (!Array.isArray(storeState)) {
          storeStateObj = assign({}, storeState);
        } else {
          storeStateObj = [...storeState];
        }
      });
      unsubscribe();
      return storeStateObj;
    };

    const updateStoreKey = (store, objValue) => {
      store.update((storeState) => {
        return assign(storeState, objValue);
      });
    };

    function toInteger(dirtyNumber) {
      if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
        return NaN;
      }

      var number = Number(dirtyNumber);

      if (isNaN(number)) {
        return number;
      }

      return number < 0 ? Math.ceil(number) : Math.floor(number);
    }

    function requiredArgs(required, args) {
      if (args.length < required) {
        throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
      }
    }

    /**
     * @name toDate
     * @category Common Helpers
     * @summary Convert the given argument to an instance of Date.
     *
     * @description
     * Convert the given argument to an instance of Date.
     *
     * If the argument is an instance of Date, the function returns its clone.
     *
     * If the argument is a number, it is treated as a timestamp.
     *
     * If the argument is none of the above, the function returns Invalid Date.
     *
     * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
     *
     * @param {Date|Number} argument - the value to convert
     * @returns {Date} the parsed date in the local time zone
     * @throws {TypeError} 1 argument required
     *
     * @example
     * // Clone the date:
     * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
     * //=> Tue Feb 11 2014 11:30:30
     *
     * @example
     * // Convert the timestamp to date:
     * const result = toDate(1392098430000)
     * //=> Tue Feb 11 2014 11:30:30
     */

    function toDate(argument) {
      requiredArgs(1, arguments);
      var argStr = Object.prototype.toString.call(argument); // Clone the date

      if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
        // Prevent the date to lose the milliseconds when passed to new Date() in IE10
        return new Date(argument.getTime());
      } else if (typeof argument === 'number' || argStr === '[object Number]') {
        return new Date(argument);
      } else {
        if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
          // eslint-disable-next-line no-console
          console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"); // eslint-disable-next-line no-console

          console.warn(new Error().stack);
        }

        return new Date(NaN);
      }
    }

    /**
     * @name addMilliseconds
     * @category Millisecond Helpers
     * @summary Add the specified number of milliseconds to the given date.
     *
     * @description
     * Add the specified number of milliseconds to the given date.
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date to be changed
     * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
     * @returns {Date} the new date with the milliseconds added
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
     * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
     * //=> Thu Jul 10 2014 12:45:30.750
     */

    function addMilliseconds(dirtyDate, dirtyAmount) {
      requiredArgs(2, arguments);
      var timestamp = toDate(dirtyDate).getTime();
      var amount = toInteger(dirtyAmount);
      return new Date(timestamp + amount);
    }

    /**
     * @name isBefore
     * @category Common Helpers
     * @summary Is the first date before the second one?
     *
     * @description
     * Is the first date before the second one?
     *
     * ### v2.0.0 breaking changes:
     *
     * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
     *
     * @param {Date|Number} date - the date that should be before the other one to return true
     * @param {Date|Number} dateToCompare - the date to compare with
     * @returns {Boolean} the first date is before the second date
     * @throws {TypeError} 2 arguments required
     *
     * @example
     * // Is 10 July 1989 before 11 February 1987?
     * var result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
     * //=> false
     */

    function isBefore(dirtyDate, dirtyDateToCompare) {
      requiredArgs(2, arguments);
      var date = toDate(dirtyDate);
      var dateToCompare = toDate(dirtyDateToCompare);
      return date.getTime() < dateToCompare.getTime();
    }

    const LS = localStorage;
    const PREFIX_KEY$1 = "SCR_ROUTER_";
    const EXPIRE_KEYS$1 = `${PREFIX_KEY$1}EXPIRE_KEYS`;

    const getItem$1 = (key) => {
      removeExpiredKeys$1();
      return fromJSON$1(LS.getItem(key));
    };

    const setItem$1 = (key, value, time) => {
      if (key === undefined || key === null || key.trim() === "") {
        return false;
      }
      if (value === undefined || value === null) {
        clearKeyList$1([key]);
        return;
      }
      removeExpiredKeys$1();
      if (
        time &&
        Number.isSafeInteger(time) &&
        Number.isInteger(time) &&
        time > 0
      ) {
        addExpireKey$1(key, time);
      }
      LS.setItem(key, toJSON$1(value));
    };

    const removeItem$1 = (key) => {
      removeExpiredKeys$1();
      const item = fromJSON$1(LS.getItem(key));
      if (item !== null && item !== undefined) {
        LS.removeItem(key);
        removeExpireKey$1(key);
      }
      return item;
    };

    const getAll$1 = () => {
      if (!LS || LS.length === 0) {
        return [];
      }
      removeExpiredKeys$1();
      let items = Object.assign({}, cloneDeep_1(LS));
      delete items[EXPIRE_KEYS$1];
      return items;
    };

    // clear all the expiration list and the keys
    const clearExpireKeys$1 = () => {
      const expire = fromJSON$1(LS.getItem(EXPIRE_KEYS$1));

      if (expire === null || expire === undefined) {
        return;
      }

      expire.map((item) => LS.removeItem(item.key));

      LS.removeItem(EXPIRE_KEYS$1);
    };

    // clear a given array list of keys
    // affects expiration key list and the keys
    const clearKeyList$1 = (keyList) => {
      if (!Array.isArray(keyList) || keyList.length === 0) {
        return;
      }

      keyList.map((key) => {
        if (LS.getItem(key)) {
          LS.removeItem(key);
          removeExpireKey$1(key);
        }
      });

      // updating the remaining list keychain if it has left any item
      let expire = fromJSON$1(LS.getItem(EXPIRE_KEYS$1));
      if (expire === null || expire === undefined) {
        return;
      }

      expire = expire.filter((item) => !keyList.includes(item.key));
      if (expire.length > 0) {
        LS.setItem(EXPIRE_KEYS$1, toJSON$1(expire));
      } else {
        LS.removeItem(EXPIRE_KEYS$1);
      }
    };

    // Function to check and remove a key if expired
    // If so... remove the key from the expiration list and the key
    const removeExpiredKeys$1 = () => {
      let keyList = [];
      let expire = fromJSON$1(LS.getItem(EXPIRE_KEYS$1));

      if (expire && expire.length > 0) {
        expire = expire.filter((item) => {
          if (
            isBefore(new Date(), new Date(item.liveUntil)) &&
            LS.getItem(item.key)
          ) {
            return true;
          }
          LS.removeItem(item.key);
          keyList.push(item.key);
        });

        if (expire.length > 0) {
          LS.setItem(EXPIRE_KEYS$1, toJSON$1(expire));
        } else {
          LS.removeItem(EXPIRE_KEYS$1);
        }
      }
      return keyList;
    };

    const setSvelteStoreInStorage$1 = (
      subscribe,
      key,
      timeout,
      ignoreKeys = []
    ) => {
      const unsubscribe = subscribe((store) => {
        for (let iKeys of ignoreKeys) {
          store[iKeys] = undefined;
        }
        setItem$1(key, store, timeout);
      });
      unsubscribe();
    };

    const getSvelteStoreInStorage$1 = (update, key) => {
      const storage = getItem$1(key);
      if (!storage) {
        return;
      }
      update(() => {
        return Object.assign({}, cloneDeep_1(storage));
      });
    };

    // ------------------------------------------------- ## BELOW THIS LINE PRIVATE FUNCTIONS ONLY ## -------------------------------------------------
    // add a key in the expiration key list
    // key: String
    // time: In milliseconds
    function addExpireKey$1(key, time) {
      if (!Number.isInteger(time) || !Number.isSafeInteger(time)) {
        throw new Error("Time to add an expire key is not a safe integer");
      }

      let expire = fromJSON$1(LS.getItem(EXPIRE_KEYS$1));
      const liveUntil = addMilliseconds(new Date(), time);

      if (expire !== null && expire !== undefined) {
        expire = expire.filter((item) => item.key !== key);
        expire.push({ key, liveUntil });
      } else {
        expire = [{ key, liveUntil }];
      }

      LS.setItem(EXPIRE_KEYS$1, toJSON$1(expire));
    }

    // removes a specific key from expiration key list, may remove the key too
    // key: String
    // expireKeyOnly: Boolean -- only = true for only remove from expireKey OR the key itself too
    function removeExpireKey$1(key, expireKeyOnly = true) {
      let expire = fromJSON$1(LS.getItem(EXPIRE_KEYS$1));
      if (expire === null || expire === undefined) {
        return;
      }

      expire = expire.filter((item) => item.key !== key);

      if (expire.length > 0) {
        LS.setItem(EXPIRE_KEYS$1, toJSON$1(expire));
      } else {
        LS.removeItem(EXPIRE_KEYS$1);
      }

      if (!expireKeyOnly && LS.getItem(key)) {
        LS.removeItem(key);
      }
    }

    function toJSON$1(item) {
      if (typeof item === "object") {
        return JSON.stringify(item);
      }
      return item;
    }

    function fromJSON$1(item) {
      if (!item) {
        return item;
      }
      try {
        return JSON.parse(item);
      } catch (err) {
        return item;
      }
    }

    // setInterval(removeExpiredKeys, 5000);

    var LS$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getItem: getItem$1,
        setItem: setItem$1,
        removeItem: removeItem$1,
        getAll: getAll$1,
        clearExpireKeys: clearExpireKeys$1,
        clearKeyList: clearKeyList$1,
        removeExpiredKeys: removeExpiredKeys$1,
        setSvelteStoreInStorage: setSvelteStoreInStorage$1,
        getSvelteStoreInStorage: getSvelteStoreInStorage$1
    });

    /*!
        localForage -- Offline Storage, Improved
        Version 1.9.0
        https://localforage.github.io/localForage
        (c) 2013-2017 Mozilla, Apache License 2.0
    */

    var localforage = createCommonjsModule(function (module, exports) {
    (function(f){{module.exports=f();}})(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
    (function (global){
    var Mutation = global.MutationObserver || global.WebKitMutationObserver;

    var scheduleDrain;

    {
      if (Mutation) {
        var called = 0;
        var observer = new Mutation(nextTick);
        var element = global.document.createTextNode('');
        observer.observe(element, {
          characterData: true
        });
        scheduleDrain = function () {
          element.data = (called = ++called % 2);
        };
      } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
        var channel = new global.MessageChannel();
        channel.port1.onmessage = nextTick;
        scheduleDrain = function () {
          channel.port2.postMessage(0);
        };
      } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
        scheduleDrain = function () {

          // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
          // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
          var scriptEl = global.document.createElement('script');
          scriptEl.onreadystatechange = function () {
            nextTick();

            scriptEl.onreadystatechange = null;
            scriptEl.parentNode.removeChild(scriptEl);
            scriptEl = null;
          };
          global.document.documentElement.appendChild(scriptEl);
        };
      } else {
        scheduleDrain = function () {
          setTimeout(nextTick, 0);
        };
      }
    }

    var draining;
    var queue = [];
    //named nextTick for less confusing stack traces
    function nextTick() {
      draining = true;
      var i, oldQueue;
      var len = queue.length;
      while (len) {
        oldQueue = queue;
        queue = [];
        i = -1;
        while (++i < len) {
          oldQueue[i]();
        }
        len = queue.length;
      }
      draining = false;
    }

    module.exports = immediate;
    function immediate(task) {
      if (queue.push(task) === 1 && !draining) {
        scheduleDrain();
      }
    }

    }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    },{}],2:[function(_dereq_,module,exports){
    var immediate = _dereq_(1);

    /* istanbul ignore next */
    function INTERNAL() {}

    var handlers = {};

    var REJECTED = ['REJECTED'];
    var FULFILLED = ['FULFILLED'];
    var PENDING = ['PENDING'];

    module.exports = Promise;

    function Promise(resolver) {
      if (typeof resolver !== 'function') {
        throw new TypeError('resolver must be a function');
      }
      this.state = PENDING;
      this.queue = [];
      this.outcome = void 0;
      if (resolver !== INTERNAL) {
        safelyResolveThenable(this, resolver);
      }
    }

    Promise.prototype["catch"] = function (onRejected) {
      return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
      if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
        typeof onRejected !== 'function' && this.state === REJECTED) {
        return this;
      }
      var promise = new this.constructor(INTERNAL);
      if (this.state !== PENDING) {
        var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
        unwrap(promise, resolver, this.outcome);
      } else {
        this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
      }

      return promise;
    };
    function QueueItem(promise, onFulfilled, onRejected) {
      this.promise = promise;
      if (typeof onFulfilled === 'function') {
        this.onFulfilled = onFulfilled;
        this.callFulfilled = this.otherCallFulfilled;
      }
      if (typeof onRejected === 'function') {
        this.onRejected = onRejected;
        this.callRejected = this.otherCallRejected;
      }
    }
    QueueItem.prototype.callFulfilled = function (value) {
      handlers.resolve(this.promise, value);
    };
    QueueItem.prototype.otherCallFulfilled = function (value) {
      unwrap(this.promise, this.onFulfilled, value);
    };
    QueueItem.prototype.callRejected = function (value) {
      handlers.reject(this.promise, value);
    };
    QueueItem.prototype.otherCallRejected = function (value) {
      unwrap(this.promise, this.onRejected, value);
    };

    function unwrap(promise, func, value) {
      immediate(function () {
        var returnValue;
        try {
          returnValue = func(value);
        } catch (e) {
          return handlers.reject(promise, e);
        }
        if (returnValue === promise) {
          handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
        } else {
          handlers.resolve(promise, returnValue);
        }
      });
    }

    handlers.resolve = function (self, value) {
      var result = tryCatch(getThen, value);
      if (result.status === 'error') {
        return handlers.reject(self, result.value);
      }
      var thenable = result.value;

      if (thenable) {
        safelyResolveThenable(self, thenable);
      } else {
        self.state = FULFILLED;
        self.outcome = value;
        var i = -1;
        var len = self.queue.length;
        while (++i < len) {
          self.queue[i].callFulfilled(value);
        }
      }
      return self;
    };
    handlers.reject = function (self, error) {
      self.state = REJECTED;
      self.outcome = error;
      var i = -1;
      var len = self.queue.length;
      while (++i < len) {
        self.queue[i].callRejected(error);
      }
      return self;
    };

    function getThen(obj) {
      // Make sure we only access the accessor once as required by the spec
      var then = obj && obj.then;
      if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
        return function appyThen() {
          then.apply(obj, arguments);
        };
      }
    }

    function safelyResolveThenable(self, thenable) {
      // Either fulfill, reject or reject with error
      var called = false;
      function onError(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.reject(self, value);
      }

      function onSuccess(value) {
        if (called) {
          return;
        }
        called = true;
        handlers.resolve(self, value);
      }

      function tryToUnwrap() {
        thenable(onSuccess, onError);
      }

      var result = tryCatch(tryToUnwrap);
      if (result.status === 'error') {
        onError(result.value);
      }
    }

    function tryCatch(func, value) {
      var out = {};
      try {
        out.value = func(value);
        out.status = 'success';
      } catch (e) {
        out.status = 'error';
        out.value = e;
      }
      return out;
    }

    Promise.resolve = resolve;
    function resolve(value) {
      if (value instanceof this) {
        return value;
      }
      return handlers.resolve(new this(INTERNAL), value);
    }

    Promise.reject = reject;
    function reject(reason) {
      var promise = new this(INTERNAL);
      return handlers.reject(promise, reason);
    }

    Promise.all = all;
    function all(iterable) {
      var self = this;
      if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
      }

      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }

      var values = new Array(len);
      var resolved = 0;
      var i = -1;
      var promise = new this(INTERNAL);

      while (++i < len) {
        allResolver(iterable[i], i);
      }
      return promise;
      function allResolver(value, i) {
        self.resolve(value).then(resolveFromAll, function (error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
        function resolveFromAll(outValue) {
          values[i] = outValue;
          if (++resolved === len && !called) {
            called = true;
            handlers.resolve(promise, values);
          }
        }
      }
    }

    Promise.race = race;
    function race(iterable) {
      var self = this;
      if (Object.prototype.toString.call(iterable) !== '[object Array]') {
        return this.reject(new TypeError('must be an array'));
      }

      var len = iterable.length;
      var called = false;
      if (!len) {
        return this.resolve([]);
      }

      var i = -1;
      var promise = new this(INTERNAL);

      while (++i < len) {
        resolver(iterable[i]);
      }
      return promise;
      function resolver(value) {
        self.resolve(value).then(function (response) {
          if (!called) {
            called = true;
            handlers.resolve(promise, response);
          }
        }, function (error) {
          if (!called) {
            called = true;
            handlers.reject(promise, error);
          }
        });
      }
    }

    },{"1":1}],3:[function(_dereq_,module,exports){
    (function (global){
    if (typeof global.Promise !== 'function') {
      global.Promise = _dereq_(2);
    }

    }).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    },{"2":2}],4:[function(_dereq_,module,exports){

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function getIDB() {
        /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
        try {
            if (typeof indexedDB !== 'undefined') {
                return indexedDB;
            }
            if (typeof webkitIndexedDB !== 'undefined') {
                return webkitIndexedDB;
            }
            if (typeof mozIndexedDB !== 'undefined') {
                return mozIndexedDB;
            }
            if (typeof OIndexedDB !== 'undefined') {
                return OIndexedDB;
            }
            if (typeof msIndexedDB !== 'undefined') {
                return msIndexedDB;
            }
        } catch (e) {
            return;
        }
    }

    var idb = getIDB();

    function isIndexedDBValid() {
        try {
            // Initialize IndexedDB; fall back to vendor-prefixed versions
            // if needed.
            if (!idb || !idb.open) {
                return false;
            }
            // We mimic PouchDB here;
            //
            // We test for openDatabase because IE Mobile identifies itself
            // as Safari. Oh the lulz...
            var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

            var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

            // Safari <10.1 does not meet our requirements for IDB support
            // (see: https://github.com/pouchdb/pouchdb/issues/5572).
            // Safari 10.1 shipped with fetch, we can use that to detect it.
            // Note: this creates issues with `window.fetch` polyfills and
            // overrides; see:
            // https://github.com/localForage/localForage/issues/856
            return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
            // some outdated implementations of IDB that appear on Samsung
            // and HTC Android devices <4.4 are missing IDBKeyRange
            // See: https://github.com/mozilla/localForage/issues/128
            // See: https://github.com/mozilla/localForage/issues/272
            typeof IDBKeyRange !== 'undefined';
        } catch (e) {
            return false;
        }
    }

    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    function createBlob(parts, properties) {
        /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
        parts = parts || [];
        properties = properties || {};
        try {
            return new Blob(parts, properties);
        } catch (e) {
            if (e.name !== 'TypeError') {
                throw e;
            }
            var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
            var builder = new Builder();
            for (var i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
        }
    }

    // This is CommonJS because lie is an external dependency, so Rollup
    // can just ignore it.
    if (typeof Promise === 'undefined') {
        // In the "nopromises" build this will just throw if you don't have
        // a global promise object, but it would throw anyway later.
        _dereq_(3);
    }
    var Promise$1 = Promise;

    function executeCallback(promise, callback) {
        if (callback) {
            promise.then(function (result) {
                callback(null, result);
            }, function (error) {
                callback(error);
            });
        }
    }

    function executeTwoCallbacks(promise, callback, errorCallback) {
        if (typeof callback === 'function') {
            promise.then(callback);
        }

        if (typeof errorCallback === 'function') {
            promise["catch"](errorCallback);
        }
    }

    function normalizeKey(key) {
        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }

        return key;
    }

    function getCallback() {
        if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
            return arguments[arguments.length - 1];
        }
    }

    // Some code originally from async_storage.js in
    // [Gaia](https://github.com/mozilla-b2g/gaia).

    var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
    var supportsBlobs = void 0;
    var dbContexts = {};
    var toString = Object.prototype.toString;

    // Transaction Modes
    var READ_ONLY = 'readonly';
    var READ_WRITE = 'readwrite';

    // Transform a binary string to an array buffer, because otherwise
    // weird stuff happens when you try to work with the binary string directly.
    // It is known.
    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
    // encode-decode-image-with-base64-breaks-image (2013-04-21)
    function _binStringToArrayBuffer(bin) {
        var length = bin.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return buf;
    }

    //
    // Blobs are not supported in all versions of IndexedDB, notably
    // Chrome <37 and Android <5. In those versions, storing a blob will throw.
    //
    // Various other blob bugs exist in Chrome v37-42 (inclusive).
    // Detecting them is expensive and confusing to users, and Chrome 37-42
    // is at very low usage worldwide, so we do a hacky userAgent check instead.
    //
    // content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
    // 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
    // FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
    //
    // Code borrowed from PouchDB. See:
    // https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
    //
    function _checkBlobSupportWithoutCaching(idb) {
        return new Promise$1(function (resolve) {
            var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
            var blob = createBlob(['']);
            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

            txn.onabort = function (e) {
                // If the transaction aborts now its due to not being able to
                // write to the database, likely due to the disk being full
                e.preventDefault();
                e.stopPropagation();
                resolve(false);
            };

            txn.oncomplete = function () {
                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
                var matchedEdge = navigator.userAgent.match(/Edge\//);
                // MS Edge pretends to be Chrome 42:
                // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
            };
        })["catch"](function () {
            return false; // error, so assume unsupported
        });
    }

    function _checkBlobSupport(idb) {
        if (typeof supportsBlobs === 'boolean') {
            return Promise$1.resolve(supportsBlobs);
        }
        return _checkBlobSupportWithoutCaching(idb).then(function (value) {
            supportsBlobs = value;
            return supportsBlobs;
        });
    }

    function _deferReadiness(dbInfo) {
        var dbContext = dbContexts[dbInfo.name];

        // Create a deferred object representing the current database operation.
        var deferredOperation = {};

        deferredOperation.promise = new Promise$1(function (resolve, reject) {
            deferredOperation.resolve = resolve;
            deferredOperation.reject = reject;
        });

        // Enqueue the deferred operation.
        dbContext.deferredOperations.push(deferredOperation);

        // Chain its promise to the database readiness.
        if (!dbContext.dbReady) {
            dbContext.dbReady = deferredOperation.promise;
        } else {
            dbContext.dbReady = dbContext.dbReady.then(function () {
                return deferredOperation.promise;
            });
        }
    }

    function _advanceReadiness(dbInfo) {
        var dbContext = dbContexts[dbInfo.name];

        // Dequeue a deferred operation.
        var deferredOperation = dbContext.deferredOperations.pop();

        // Resolve its promise (which is part of the database readiness
        // chain of promises).
        if (deferredOperation) {
            deferredOperation.resolve();
            return deferredOperation.promise;
        }
    }

    function _rejectReadiness(dbInfo, err) {
        var dbContext = dbContexts[dbInfo.name];

        // Dequeue a deferred operation.
        var deferredOperation = dbContext.deferredOperations.pop();

        // Reject its promise (which is part of the database readiness
        // chain of promises).
        if (deferredOperation) {
            deferredOperation.reject(err);
            return deferredOperation.promise;
        }
    }

    function _getConnection(dbInfo, upgradeNeeded) {
        return new Promise$1(function (resolve, reject) {
            dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

            if (dbInfo.db) {
                if (upgradeNeeded) {
                    _deferReadiness(dbInfo);
                    dbInfo.db.close();
                } else {
                    return resolve(dbInfo.db);
                }
            }

            var dbArgs = [dbInfo.name];

            if (upgradeNeeded) {
                dbArgs.push(dbInfo.version);
            }

            var openreq = idb.open.apply(idb, dbArgs);

            if (upgradeNeeded) {
                openreq.onupgradeneeded = function (e) {
                    var db = openreq.result;
                    try {
                        db.createObjectStore(dbInfo.storeName);
                        if (e.oldVersion <= 1) {
                            // Added when support for blob shims was added
                            db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                        }
                    } catch (ex) {
                        if (ex.name === 'ConstraintError') {
                            console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                        } else {
                            throw ex;
                        }
                    }
                };
            }

            openreq.onerror = function (e) {
                e.preventDefault();
                reject(openreq.error);
            };

            openreq.onsuccess = function () {
                resolve(openreq.result);
                _advanceReadiness(dbInfo);
            };
        });
    }

    function _getOriginalConnection(dbInfo) {
        return _getConnection(dbInfo, false);
    }

    function _getUpgradedConnection(dbInfo) {
        return _getConnection(dbInfo, true);
    }

    function _isUpgradeNeeded(dbInfo, defaultVersion) {
        if (!dbInfo.db) {
            return true;
        }

        var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
        var isDowngrade = dbInfo.version < dbInfo.db.version;
        var isUpgrade = dbInfo.version > dbInfo.db.version;

        if (isDowngrade) {
            // If the version is not the default one
            // then warn for impossible downgrade.
            if (dbInfo.version !== defaultVersion) {
                console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
            }
            // Align the versions to prevent errors.
            dbInfo.version = dbInfo.db.version;
        }

        if (isUpgrade || isNewStore) {
            // If the store is new then increment the version (if needed).
            // This will trigger an "upgradeneeded" event which is required
            // for creating a store.
            if (isNewStore) {
                var incVersion = dbInfo.db.version + 1;
                if (incVersion > dbInfo.version) {
                    dbInfo.version = incVersion;
                }
            }

            return true;
        }

        return false;
    }

    // encode a blob for indexeddb engines that don't support blobs
    function _encodeBlob(blob) {
        return new Promise$1(function (resolve, reject) {
            var reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = function (e) {
                var base64 = btoa(e.target.result || '');
                resolve({
                    __local_forage_encoded_blob: true,
                    data: base64,
                    type: blob.type
                });
            };
            reader.readAsBinaryString(blob);
        });
    }

    // decode an encoded blob
    function _decodeBlob(encodedBlob) {
        var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
        return createBlob([arrayBuff], { type: encodedBlob.type });
    }

    // is this one of our fancy encoded blobs?
    function _isEncodedBlob(value) {
        return value && value.__local_forage_encoded_blob;
    }

    // Specialize the default `ready()` function by making it dependent
    // on the current database operations. Thus, the driver will be actually
    // ready when it's been initialized (default) *and* there are no pending
    // operations on the database (initiated by some other instances).
    function _fullyReady(callback) {
        var self = this;

        var promise = self._initReady().then(function () {
            var dbContext = dbContexts[self._dbInfo.name];

            if (dbContext && dbContext.dbReady) {
                return dbContext.dbReady;
            }
        });

        executeTwoCallbacks(promise, callback, callback);
        return promise;
    }

    // Try to establish a new db connection to replace the
    // current one which is broken (i.e. experiencing
    // InvalidStateError while creating a transaction).
    function _tryReconnect(dbInfo) {
        _deferReadiness(dbInfo);

        var dbContext = dbContexts[dbInfo.name];
        var forages = dbContext.forages;

        for (var i = 0; i < forages.length; i++) {
            var forage = forages[i];
            if (forage._dbInfo.db) {
                forage._dbInfo.db.close();
                forage._dbInfo.db = null;
            }
        }
        dbInfo.db = null;

        return _getOriginalConnection(dbInfo).then(function (db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo)) {
                // Reopen the database for upgrading.
                return _getUpgradedConnection(dbInfo);
            }
            return db;
        }).then(function (db) {
            // store the latest db reference
            // in case the db was upgraded
            dbInfo.db = dbContext.db = db;
            for (var i = 0; i < forages.length; i++) {
                forages[i]._dbInfo.db = db;
            }
        })["catch"](function (err) {
            _rejectReadiness(dbInfo, err);
            throw err;
        });
    }

    // FF doesn't like Promises (micro-tasks) and IDDB store operations,
    // so we have to do it with callbacks
    function createTransaction(dbInfo, mode, callback, retries) {
        if (retries === undefined) {
            retries = 1;
        }

        try {
            var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
            callback(null, tx);
        } catch (err) {
            if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
                return Promise$1.resolve().then(function () {
                    if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                        // increase the db version, to create the new ObjectStore
                        if (dbInfo.db) {
                            dbInfo.version = dbInfo.db.version + 1;
                        }
                        // Reopen the database for upgrading.
                        return _getUpgradedConnection(dbInfo);
                    }
                }).then(function () {
                    return _tryReconnect(dbInfo).then(function () {
                        createTransaction(dbInfo, mode, callback, retries - 1);
                    });
                })["catch"](callback);
            }

            callback(err);
        }
    }

    function createDbContext() {
        return {
            // Running localForages sharing a database.
            forages: [],
            // Shared database.
            db: null,
            // Database readiness (promise).
            dbReady: null,
            // Deferred operations on the database.
            deferredOperations: []
        };
    }

    // Open the IndexedDB database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage(options) {
        var self = this;
        var dbInfo = {
            db: null
        };

        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        // Get the current context of the database;
        var dbContext = dbContexts[dbInfo.name];

        // ...or create a new context.
        if (!dbContext) {
            dbContext = createDbContext();
            // Register the new context in the global container.
            dbContexts[dbInfo.name] = dbContext;
        }

        // Register itself as a running localForage in the current context.
        dbContext.forages.push(self);

        // Replace the default `ready()` function with the specialized one.
        if (!self._initReady) {
            self._initReady = self.ready;
            self.ready = _fullyReady;
        }

        // Create an array of initialization states of the related localForages.
        var initPromises = [];

        function ignoreErrors() {
            // Don't handle errors here,
            // just makes sure related localForages aren't pending.
            return Promise$1.resolve();
        }

        for (var j = 0; j < dbContext.forages.length; j++) {
            var forage = dbContext.forages[j];
            if (forage !== self) {
                // Don't wait for itself...
                initPromises.push(forage._initReady()["catch"](ignoreErrors));
            }
        }

        // Take a snapshot of the related localForages.
        var forages = dbContext.forages.slice(0);

        // Initialize the connection process only when
        // all the related localForages aren't pending.
        return Promise$1.all(initPromises).then(function () {
            dbInfo.db = dbContext.db;
            // Get the connection or open a new one without upgrade.
            return _getOriginalConnection(dbInfo);
        }).then(function (db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
                // Reopen the database for upgrading.
                return _getUpgradedConnection(dbInfo);
            }
            return db;
        }).then(function (db) {
            dbInfo.db = dbContext.db = db;
            self._dbInfo = dbInfo;
            // Share the final connection amongst related localForages.
            for (var k = 0; k < forages.length; k++) {
                var forage = forages[k];
                if (forage !== self) {
                    // Self is already up-to-date.
                    forage._dbInfo.db = dbInfo.db;
                    forage._dbInfo.version = dbInfo.version;
                }
            }
        });
    }

    function getItem(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.get(key);

                        req.onsuccess = function () {
                            var value = req.result;
                            if (value === undefined) {
                                value = null;
                            }
                            if (_isEncodedBlob(value)) {
                                value = _decodeBlob(value);
                            }
                            resolve(value);
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Iterate over all items stored in database.
    function iterate(iterator, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.openCursor();
                        var iterationNumber = 1;

                        req.onsuccess = function () {
                            var cursor = req.result;

                            if (cursor) {
                                var value = cursor.value;
                                if (_isEncodedBlob(value)) {
                                    value = _decodeBlob(value);
                                }
                                var result = iterator(value, cursor.key, iterationNumber++);

                                // when the iterator callback returns any
                                // (non-`undefined`) value, then we stop
                                // the iteration immediately
                                if (result !== void 0) {
                                    resolve(result);
                                } else {
                                    cursor["continue"]();
                                }
                            } else {
                                resolve();
                            }
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);

        return promise;
    }

    function setItem(key, value, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            var dbInfo;
            self.ready().then(function () {
                dbInfo = self._dbInfo;
                if (toString.call(value) === '[object Blob]') {
                    return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                        if (blobSupport) {
                            return value;
                        }
                        return _encodeBlob(value);
                    });
                }
                return value;
            }).then(function (value) {
                createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);

                        // The reason we don't _save_ null is because IE 10 does
                        // not support saving the `null` type in IndexedDB. How
                        // ironic, given the bug below!
                        // See: https://github.com/mozilla/localForage/issues/161
                        if (value === null) {
                            value = undefined;
                        }

                        var req = store.put(value, key);

                        transaction.oncomplete = function () {
                            // Cast to undefined so the value passed to
                            // callback/promise is the same as what one would get out
                            // of `getItem()` later. This leads to some weirdness
                            // (setItem('foo', undefined) will return `null`), but
                            // it's not my fault localStorage is our baseline and that
                            // it's weird.
                            if (value === undefined) {
                                value = null;
                            }

                            resolve(value);
                        };
                        transaction.onabort = transaction.onerror = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function removeItem(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        // We use a Grunt task to make this safe for IE and some
                        // versions of Android (including those used by Cordova).
                        // Normally IE won't like `.delete()` and will insist on
                        // using `['delete']()`, but we have a build step that
                        // fixes this for us now.
                        var req = store["delete"](key);
                        transaction.oncomplete = function () {
                            resolve();
                        };

                        transaction.onerror = function () {
                            reject(req.error);
                        };

                        // The request will be also be aborted if we've exceeded our storage
                        // space.
                        transaction.onabort = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function clear(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.clear();

                        transaction.oncomplete = function () {
                            resolve();
                        };

                        transaction.onabort = transaction.onerror = function () {
                            var err = req.error ? req.error : req.transaction.error;
                            reject(err);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function length(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.count();

                        req.onsuccess = function () {
                            resolve(req.result);
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function key(n, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            if (n < 0) {
                resolve(null);

                return;
            }

            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var advanced = false;
                        var req = store.openKeyCursor();

                        req.onsuccess = function () {
                            var cursor = req.result;
                            if (!cursor) {
                                // this means there weren't enough keys
                                resolve(null);

                                return;
                            }

                            if (n === 0) {
                                // We have the first key, return it if that's what they
                                // wanted.
                                resolve(cursor.key);
                            } else {
                                if (!advanced) {
                                    // Otherwise, ask the cursor to skip ahead n
                                    // records.
                                    advanced = true;
                                    cursor.advance(n);
                                } else {
                                    // When we get here, we've got the nth key.
                                    resolve(cursor.key);
                                }
                            }
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                    if (err) {
                        return reject(err);
                    }

                    try {
                        var store = transaction.objectStore(self._dbInfo.storeName);
                        var req = store.openKeyCursor();
                        var keys = [];

                        req.onsuccess = function () {
                            var cursor = req.result;

                            if (!cursor) {
                                resolve(keys);
                                return;
                            }

                            keys.push(cursor.key);
                            cursor["continue"]();
                        };

                        req.onerror = function () {
                            reject(req.error);
                        };
                    } catch (e) {
                        reject(e);
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function dropInstance(options, callback) {
        callback = getCallback.apply(this, arguments);

        var currentConfig = this.config();
        options = typeof options !== 'function' && options || {};
        if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
        }

        var self = this;
        var promise;
        if (!options.name) {
            promise = Promise$1.reject('Invalid arguments');
        } else {
            var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

            var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                dbContext.db = db;
                for (var i = 0; i < forages.length; i++) {
                    forages[i]._dbInfo.db = db;
                }
                return db;
            });

            if (!options.storeName) {
                promise = dbPromise.then(function (db) {
                    _deferReadiness(options);

                    var dbContext = dbContexts[options.name];
                    var forages = dbContext.forages;

                    db.close();
                    for (var i = 0; i < forages.length; i++) {
                        var forage = forages[i];
                        forage._dbInfo.db = null;
                    }

                    var dropDBPromise = new Promise$1(function (resolve, reject) {
                        var req = idb.deleteDatabase(options.name);

                        req.onerror = req.onblocked = function (err) {
                            var db = req.result;
                            if (db) {
                                db.close();
                            }
                            reject(err);
                        };

                        req.onsuccess = function () {
                            var db = req.result;
                            if (db) {
                                db.close();
                            }
                            resolve(db);
                        };
                    });

                    return dropDBPromise.then(function (db) {
                        dbContext.db = db;
                        for (var i = 0; i < forages.length; i++) {
                            var _forage = forages[i];
                            _advanceReadiness(_forage._dbInfo);
                        }
                    })["catch"](function (err) {
                        (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                        throw err;
                    });
                });
            } else {
                promise = dbPromise.then(function (db) {
                    if (!db.objectStoreNames.contains(options.storeName)) {
                        return;
                    }

                    var newVersion = db.version + 1;

                    _deferReadiness(options);

                    var dbContext = dbContexts[options.name];
                    var forages = dbContext.forages;

                    db.close();
                    for (var i = 0; i < forages.length; i++) {
                        var forage = forages[i];
                        forage._dbInfo.db = null;
                        forage._dbInfo.version = newVersion;
                    }

                    var dropObjectPromise = new Promise$1(function (resolve, reject) {
                        var req = idb.open(options.name, newVersion);

                        req.onerror = function (err) {
                            var db = req.result;
                            db.close();
                            reject(err);
                        };

                        req.onupgradeneeded = function () {
                            var db = req.result;
                            db.deleteObjectStore(options.storeName);
                        };

                        req.onsuccess = function () {
                            var db = req.result;
                            db.close();
                            resolve(db);
                        };
                    });

                    return dropObjectPromise.then(function (db) {
                        dbContext.db = db;
                        for (var j = 0; j < forages.length; j++) {
                            var _forage2 = forages[j];
                            _forage2._dbInfo.db = db;
                            _advanceReadiness(_forage2._dbInfo);
                        }
                    })["catch"](function (err) {
                        (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                        throw err;
                    });
                });
            }
        }

        executeCallback(promise, callback);
        return promise;
    }

    var asyncStorage = {
        _driver: 'asyncStorage',
        _initStorage: _initStorage,
        _support: isIndexedDBValid(),
        iterate: iterate,
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        clear: clear,
        length: length,
        key: key,
        keys: keys,
        dropInstance: dropInstance
    };

    function isWebSQLValid() {
        return typeof openDatabase === 'function';
    }

    // Sadly, the best way to save binary data in WebSQL/localStorage is serializing
    // it to Base64, so this is how we store it to prevent very strange errors with less
    // verbose ways of binary <-> string data storage.
    var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var BLOB_TYPE_PREFIX = '~~local_forage_type~';
    var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

    var SERIALIZED_MARKER = '__lfsc__:';
    var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

    // OMG the serializations!
    var TYPE_ARRAYBUFFER = 'arbf';
    var TYPE_BLOB = 'blob';
    var TYPE_INT8ARRAY = 'si08';
    var TYPE_UINT8ARRAY = 'ui08';
    var TYPE_UINT8CLAMPEDARRAY = 'uic8';
    var TYPE_INT16ARRAY = 'si16';
    var TYPE_INT32ARRAY = 'si32';
    var TYPE_UINT16ARRAY = 'ur16';
    var TYPE_UINT32ARRAY = 'ui32';
    var TYPE_FLOAT32ARRAY = 'fl32';
    var TYPE_FLOAT64ARRAY = 'fl64';
    var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

    var toString$1 = Object.prototype.toString;

    function stringToBuffer(serializedString) {
        // Fill the string into a ArrayBuffer.
        var bufferLength = serializedString.length * 0.75;
        var len = serializedString.length;
        var i;
        var p = 0;
        var encoded1, encoded2, encoded3, encoded4;

        if (serializedString[serializedString.length - 1] === '=') {
            bufferLength--;
            if (serializedString[serializedString.length - 2] === '=') {
                bufferLength--;
            }
        }

        var buffer = new ArrayBuffer(bufferLength);
        var bytes = new Uint8Array(buffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = BASE_CHARS.indexOf(serializedString[i]);
            encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
            encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
            encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

            /*jslint bitwise: true */
            bytes[p++] = encoded1 << 2 | encoded2 >> 4;
            bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
            bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
        }
        return buffer;
    }

    // Converts a buffer to a string to store, serialized, in the backend
    // storage library.
    function bufferToString(buffer) {
        // base64-arraybuffer
        var bytes = new Uint8Array(buffer);
        var base64String = '';
        var i;

        for (i = 0; i < bytes.length; i += 3) {
            /*jslint bitwise: true */
            base64String += BASE_CHARS[bytes[i] >> 2];
            base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
            base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
            base64String += BASE_CHARS[bytes[i + 2] & 63];
        }

        if (bytes.length % 3 === 2) {
            base64String = base64String.substring(0, base64String.length - 1) + '=';
        } else if (bytes.length % 3 === 1) {
            base64String = base64String.substring(0, base64String.length - 2) + '==';
        }

        return base64String;
    }

    // Serialize a value, afterwards executing a callback (which usually
    // instructs the `setItem()` callback/promise to be executed). This is how
    // we store binary data with localStorage.
    function serialize(value, callback) {
        var valueType = '';
        if (value) {
            valueType = toString$1.call(value);
        }

        // Cannot use `value instanceof ArrayBuffer` or such here, as these
        // checks fail when running the tests using casper.js...
        //
        // TODO: See why those tests fail and use a better solution.
        if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
            // Convert binary arrays to a string and prefix the string with
            // a special marker.
            var buffer;
            var marker = SERIALIZED_MARKER;

            if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
            } else {
                buffer = value.buffer;

                if (valueType === '[object Int8Array]') {
                    marker += TYPE_INT8ARRAY;
                } else if (valueType === '[object Uint8Array]') {
                    marker += TYPE_UINT8ARRAY;
                } else if (valueType === '[object Uint8ClampedArray]') {
                    marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueType === '[object Int16Array]') {
                    marker += TYPE_INT16ARRAY;
                } else if (valueType === '[object Uint16Array]') {
                    marker += TYPE_UINT16ARRAY;
                } else if (valueType === '[object Int32Array]') {
                    marker += TYPE_INT32ARRAY;
                } else if (valueType === '[object Uint32Array]') {
                    marker += TYPE_UINT32ARRAY;
                } else if (valueType === '[object Float32Array]') {
                    marker += TYPE_FLOAT32ARRAY;
                } else if (valueType === '[object Float64Array]') {
                    marker += TYPE_FLOAT64ARRAY;
                } else {
                    callback(new Error('Failed to get type for BinaryArray'));
                }
            }

            callback(marker + bufferToString(buffer));
        } else if (valueType === '[object Blob]') {
            // Conver the blob to a binaryArray and then to a string.
            var fileReader = new FileReader();

            fileReader.onload = function () {
                // Backwards-compatible prefix for the blob type.
                var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };

            fileReader.readAsArrayBuffer(value);
        } else {
            try {
                callback(JSON.stringify(value));
            } catch (e) {
                console.error("Couldn't convert value into a JSON string: ", value);

                callback(null, e);
            }
        }
    }

    // Deserialize data we've inserted into a value column/field. We place
    // special markers into our strings to mark them as encoded; this isn't
    // as nice as a meta field, but it's the only sane thing we can do whilst
    // keeping localStorage support intact.
    //
    // Oftentimes this will just deserialize JSON content, but if we have a
    // special marker (SERIALIZED_MARKER, defined above), we will extract
    // some kind of arraybuffer/binary data/typed array out of the string.
    function deserialize(value) {
        // If we haven't marked this string as being specially serialized (i.e.
        // something other than serialized JSON), we can just return it and be
        // done with it.
        if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
        }

        // The following code deals with deserializing some kind of Blob or
        // TypedArray. First we separate out the type of data we're dealing
        // with from the data itself.
        var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
        var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

        var blobType;
        // Backwards-compatible blob type serialization strategy.
        // DBs created with older versions of localForage will simply not have the blob type.
        if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
            blobType = matcher[1];
            serializedString = serializedString.substring(matcher[0].length);
        }
        var buffer = stringToBuffer(serializedString);

        // Return the right type based on the code/type set during
        // serialization.
        switch (type) {
            case TYPE_ARRAYBUFFER:
                return buffer;
            case TYPE_BLOB:
                return createBlob([buffer], { type: blobType });
            case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
            default:
                throw new Error('Unkown type: ' + type);
        }
    }

    var localforageSerializer = {
        serialize: serialize,
        deserialize: deserialize,
        stringToBuffer: stringToBuffer,
        bufferToString: bufferToString
    };

    /*
     * Includes code from:
     *
     * base64-arraybuffer
     * https://github.com/niklasvh/base64-arraybuffer
     *
     * Copyright (c) 2012 Niklas von Hertzen
     * Licensed under the MIT license.
     */

    function createDbTable(t, dbInfo, callback, errorCallback) {
        t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
    }

    // Open the WebSQL database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage$1(options) {
        var self = this;
        var dbInfo = {
            db: null
        };

        if (options) {
            for (var i in options) {
                dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
            }
        }

        var dbInfoPromise = new Promise$1(function (resolve, reject) {
            // Open the database; the openDatabase API will automatically
            // create it for us if it doesn't exist.
            try {
                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
            } catch (e) {
                return reject(e);
            }

            // Create our key/value table if it doesn't exist.
            dbInfo.db.transaction(function (t) {
                createDbTable(t, dbInfo, function () {
                    self._dbInfo = dbInfo;
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            }, reject);
        });

        dbInfo.serializer = localforageSerializer;
        return dbInfoPromise;
    }

    function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
        t.executeSql(sqlStatement, args, callback, function (t, error) {
            if (error.code === error.SYNTAX_ERR) {
                t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
                    if (!results.rows.length) {
                        // if the table is missing (was deleted)
                        // re-create it table and retry
                        createDbTable(t, dbInfo, function () {
                            t.executeSql(sqlStatement, args, callback, errorCallback);
                        }, errorCallback);
                    } else {
                        errorCallback(t, error);
                    }
                }, errorCallback);
            } else {
                errorCallback(t, error);
            }
        }, errorCallback);
    }

    function getItem$1(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                        var result = results.rows.length ? results.rows.item(0).value : null;

                        // Check to see if this is serialized content we need to
                        // unpack.
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function iterate$1(iterator, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;

                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                        var rows = results.rows;
                        var length = rows.length;

                        for (var i = 0; i < length; i++) {
                            var item = rows.item(i);
                            var result = item.value;

                            // Check to see if this is serialized content
                            // we need to unpack.
                            if (result) {
                                result = dbInfo.serializer.deserialize(result);
                            }

                            result = iterator(result, item.key, i + 1);

                            // void(0) prevents problems with redefinition
                            // of `undefined`.
                            if (result !== void 0) {
                                resolve(result);
                                return;
                            }
                        }

                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function _setItem(key, value, callback, retriesLeft) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                // The localStorage API doesn't return undefined values in an
                // "expected" way, so undefined is always cast to null in all
                // drivers. See: https://github.com/mozilla/localForage/pull/42
                if (value === undefined) {
                    value = null;
                }

                // Save the original value to pass to the callback.
                var originalValue = value;

                var dbInfo = self._dbInfo;
                dbInfo.serializer.serialize(value, function (value, error) {
                    if (error) {
                        reject(error);
                    } else {
                        dbInfo.db.transaction(function (t) {
                            tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
                                resolve(originalValue);
                            }, function (t, error) {
                                reject(error);
                            });
                        }, function (sqlError) {
                            // The transaction failed; check
                            // to see if it's a quota error.
                            if (sqlError.code === sqlError.QUOTA_ERR) {
                                // We reject the callback outright for now, but
                                // it's worth trying to re-run the transaction.
                                // Even if the user accepts the prompt to use
                                // more storage on Safari, this error will
                                // be called.
                                //
                                // Try to re-run the transaction.
                                if (retriesLeft > 0) {
                                    resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                    return;
                                }
                                reject(sqlError);
                            }
                        });
                    }
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function setItem$1(key, value, callback) {
        return _setItem.apply(this, [key, value, callback, 1]);
    }

    function removeItem$1(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Deletes every item in the table.
    // TODO: Find out if this resets the AUTO_INCREMENT number.
    function clear$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
                        resolve();
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Does a simple `COUNT(key)` to get the number of items stored in
    // localForage.
    function length$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    // Ahhh, SQL makes this one soooooo easy.
                    tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                        var result = results.rows.item(0).c;
                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Return the key located at key index X; essentially gets the key from a
    // `WHERE id = ?`. This is the most efficient way I can think to implement
    // this rarely-used (in my experience) part of the API, but it can seem
    // inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
    // the ID of each key will change every time it's updated. Perhaps a stored
    // procedure for the `setItem()` SQL would solve this problem?
    // TODO: Don't change ID on `setItem()`.
    function key$1(n, callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                        var result = results.rows.length ? results.rows.item(0).key : null;
                        resolve(result);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys$1(callback) {
        var self = this;

        var promise = new Promise$1(function (resolve, reject) {
            self.ready().then(function () {
                var dbInfo = self._dbInfo;
                dbInfo.db.transaction(function (t) {
                    tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                        var keys = [];

                        for (var i = 0; i < results.rows.length; i++) {
                            keys.push(results.rows.item(i).key);
                        }

                        resolve(keys);
                    }, function (t, error) {
                        reject(error);
                    });
                });
            })["catch"](reject);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // https://www.w3.org/TR/webdatabase/#databases
    // > There is no way to enumerate or delete the databases available for an origin from this API.
    function getAllStoreNames(db) {
        return new Promise$1(function (resolve, reject) {
            db.transaction(function (t) {
                t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
                    var storeNames = [];

                    for (var i = 0; i < results.rows.length; i++) {
                        storeNames.push(results.rows.item(i).name);
                    }

                    resolve({
                        db: db,
                        storeNames: storeNames
                    });
                }, function (t, error) {
                    reject(error);
                });
            }, function (sqlError) {
                reject(sqlError);
            });
        });
    }

    function dropInstance$1(options, callback) {
        callback = getCallback.apply(this, arguments);

        var currentConfig = this.config();
        options = typeof options !== 'function' && options || {};
        if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
        }

        var self = this;
        var promise;
        if (!options.name) {
            promise = Promise$1.reject('Invalid arguments');
        } else {
            promise = new Promise$1(function (resolve) {
                var db;
                if (options.name === currentConfig.name) {
                    // use the db reference of the current instance
                    db = self._dbInfo.db;
                } else {
                    db = openDatabase(options.name, '', '', 0);
                }

                if (!options.storeName) {
                    // drop all database tables
                    resolve(getAllStoreNames(db));
                } else {
                    resolve({
                        db: db,
                        storeNames: [options.storeName]
                    });
                }
            }).then(function (operationInfo) {
                return new Promise$1(function (resolve, reject) {
                    operationInfo.db.transaction(function (t) {
                        function dropTable(storeName) {
                            return new Promise$1(function (resolve, reject) {
                                t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
                                    resolve();
                                }, function (t, error) {
                                    reject(error);
                                });
                            });
                        }

                        var operations = [];
                        for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                            operations.push(dropTable(operationInfo.storeNames[i]));
                        }

                        Promise$1.all(operations).then(function () {
                            resolve();
                        })["catch"](function (e) {
                            reject(e);
                        });
                    }, function (sqlError) {
                        reject(sqlError);
                    });
                });
            });
        }

        executeCallback(promise, callback);
        return promise;
    }

    var webSQLStorage = {
        _driver: 'webSQLStorage',
        _initStorage: _initStorage$1,
        _support: isWebSQLValid(),
        iterate: iterate$1,
        getItem: getItem$1,
        setItem: setItem$1,
        removeItem: removeItem$1,
        clear: clear$1,
        length: length$1,
        key: key$1,
        keys: keys$1,
        dropInstance: dropInstance$1
    };

    function isLocalStorageValid() {
        try {
            return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
            // in IE8 typeof localStorage.setItem === 'object'
            !!localStorage.setItem;
        } catch (e) {
            return false;
        }
    }

    function _getKeyPrefix(options, defaultConfig) {
        var keyPrefix = options.name + '/';

        if (options.storeName !== defaultConfig.storeName) {
            keyPrefix += options.storeName + '/';
        }
        return keyPrefix;
    }

    // Check if localStorage throws when saving an item
    function checkIfLocalStorageThrows() {
        var localStorageTestKey = '_localforage_support_test';

        try {
            localStorage.setItem(localStorageTestKey, true);
            localStorage.removeItem(localStorageTestKey);

            return false;
        } catch (e) {
            return true;
        }
    }

    // Check if localStorage is usable and allows to save an item
    // This method checks if localStorage is usable in Safari Private Browsing
    // mode, or in any other case where the available quota for localStorage
    // is 0 and there wasn't any saved items yet.
    function _isLocalStorageUsable() {
        return !checkIfLocalStorageThrows() || localStorage.length > 0;
    }

    // Config the localStorage backend, using options set in the config.
    function _initStorage$2(options) {
        var self = this;
        var dbInfo = {};
        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

        if (!_isLocalStorageUsable()) {
            return Promise$1.reject();
        }

        self._dbInfo = dbInfo;
        dbInfo.serializer = localforageSerializer;

        return Promise$1.resolve();
    }

    // Remove all keys from the datastore, effectively destroying all data in
    // the app's key/value store!
    function clear$2(callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var keyPrefix = self._dbInfo.keyPrefix;

            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);

                if (key.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key);
                }
            }
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Retrieve an item from the store. Unlike the original async_storage
    // library in Gaia, we don't modify return values at all. If a key's value
    // is `undefined`, we pass that value to the callback function.
    function getItem$2(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var result = localStorage.getItem(dbInfo.keyPrefix + key);

            // If a result was found, parse it from the serialized
            // string into a JS object. If result isn't truthy, the key
            // is likely undefined and we'll pass it straight to the
            // callback.
            if (result) {
                result = dbInfo.serializer.deserialize(result);
            }

            return result;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Iterate over all items in the store.
    function iterate$2(iterator, callback) {
        var self = this;

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var keyPrefix = dbInfo.keyPrefix;
            var keyPrefixLength = keyPrefix.length;
            var length = localStorage.length;

            // We use a dedicated iterator instead of the `i` variable below
            // so other keys we fetch in localStorage aren't counted in
            // the `iterationNumber` argument passed to the `iterate()`
            // callback.
            //
            // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
            var iterationNumber = 1;

            for (var i = 0; i < length; i++) {
                var key = localStorage.key(i);
                if (key.indexOf(keyPrefix) !== 0) {
                    continue;
                }
                var value = localStorage.getItem(key);

                // If a result was found, parse it from the serialized
                // string into a JS object. If result isn't truthy, the
                // key is likely undefined and we'll pass it straight
                // to the iterator.
                if (value) {
                    value = dbInfo.serializer.deserialize(value);
                }

                value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

                if (value !== void 0) {
                    return value;
                }
            }
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Same as localStorage's key() method, except takes a callback.
    function key$2(n, callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var result;
            try {
                result = localStorage.key(n);
            } catch (error) {
                result = null;
            }

            // Remove the prefix from the key, if a key is found.
            if (result) {
                result = result.substring(dbInfo.keyPrefix.length);
            }

            return result;
        });

        executeCallback(promise, callback);
        return promise;
    }

    function keys$2(callback) {
        var self = this;
        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            var length = localStorage.length;
            var keys = [];

            for (var i = 0; i < length; i++) {
                var itemKey = localStorage.key(i);
                if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                    keys.push(itemKey.substring(dbInfo.keyPrefix.length));
                }
            }

            return keys;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Supply the number of keys in the datastore to the callback function.
    function length$2(callback) {
        var self = this;
        var promise = self.keys().then(function (keys) {
            return keys.length;
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Remove an item from the store, nice and simple.
    function removeItem$2(key, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = self.ready().then(function () {
            var dbInfo = self._dbInfo;
            localStorage.removeItem(dbInfo.keyPrefix + key);
        });

        executeCallback(promise, callback);
        return promise;
    }

    // Set a key's value and run an optional callback once the value is set.
    // Unlike Gaia's implementation, the callback function is passed the value,
    // in case you want to operate on that value only after you're sure it
    // saved, or something like that.
    function setItem$2(key, value, callback) {
        var self = this;

        key = normalizeKey(key);

        var promise = self.ready().then(function () {
            // Convert undefined values to null.
            // https://github.com/mozilla/localForage/pull/42
            if (value === undefined) {
                value = null;
            }

            // Save the original value to pass to the callback.
            var originalValue = value;

            return new Promise$1(function (resolve, reject) {
                var dbInfo = self._dbInfo;
                dbInfo.serializer.serialize(value, function (value, error) {
                    if (error) {
                        reject(error);
                    } else {
                        try {
                            localStorage.setItem(dbInfo.keyPrefix + key, value);
                            resolve(originalValue);
                        } catch (e) {
                            // localStorage capacity exceeded.
                            // TODO: Make this a specific error/event.
                            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                                reject(e);
                            }
                            reject(e);
                        }
                    }
                });
            });
        });

        executeCallback(promise, callback);
        return promise;
    }

    function dropInstance$2(options, callback) {
        callback = getCallback.apply(this, arguments);

        options = typeof options !== 'function' && options || {};
        if (!options.name) {
            var currentConfig = this.config();
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
        }

        var self = this;
        var promise;
        if (!options.name) {
            promise = Promise$1.reject('Invalid arguments');
        } else {
            promise = new Promise$1(function (resolve) {
                if (!options.storeName) {
                    resolve(options.name + '/');
                } else {
                    resolve(_getKeyPrefix(options, self._defaultConfig));
                }
            }).then(function (keyPrefix) {
                for (var i = localStorage.length - 1; i >= 0; i--) {
                    var key = localStorage.key(i);

                    if (key.indexOf(keyPrefix) === 0) {
                        localStorage.removeItem(key);
                    }
                }
            });
        }

        executeCallback(promise, callback);
        return promise;
    }

    var localStorageWrapper = {
        _driver: 'localStorageWrapper',
        _initStorage: _initStorage$2,
        _support: isLocalStorageValid(),
        iterate: iterate$2,
        getItem: getItem$2,
        setItem: setItem$2,
        removeItem: removeItem$2,
        clear: clear$2,
        length: length$2,
        key: key$2,
        keys: keys$2,
        dropInstance: dropInstance$2
    };

    var sameValue = function sameValue(x, y) {
        return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
    };

    var includes = function includes(array, searchElement) {
        var len = array.length;
        var i = 0;
        while (i < len) {
            if (sameValue(array[i], searchElement)) {
                return true;
            }
            i++;
        }

        return false;
    };

    var isArray = Array.isArray || function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };

    // Drivers are stored here when `defineDriver()` is called.
    // They are shared across all instances of localForage.
    var DefinedDrivers = {};

    var DriverSupport = {};

    var DefaultDrivers = {
        INDEXEDDB: asyncStorage,
        WEBSQL: webSQLStorage,
        LOCALSTORAGE: localStorageWrapper
    };

    var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

    var OptionalDriverMethods = ['dropInstance'];

    var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

    var DefaultConfig = {
        description: '',
        driver: DefaultDriverOrder.slice(),
        name: 'localforage',
        // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
        // we can use without a prompt.
        size: 4980736,
        storeName: 'keyvaluepairs',
        version: 1.0
    };

    function callWhenReady(localForageInstance, libraryMethod) {
        localForageInstance[libraryMethod] = function () {
            var _args = arguments;
            return localForageInstance.ready().then(function () {
                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
            });
        };
    }

    function extend() {
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];

            if (arg) {
                for (var _key in arg) {
                    if (arg.hasOwnProperty(_key)) {
                        if (isArray(arg[_key])) {
                            arguments[0][_key] = arg[_key].slice();
                        } else {
                            arguments[0][_key] = arg[_key];
                        }
                    }
                }
            }
        }

        return arguments[0];
    }

    var LocalForage = function () {
        function LocalForage(options) {
            _classCallCheck(this, LocalForage);

            for (var driverTypeKey in DefaultDrivers) {
                if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                    var driver = DefaultDrivers[driverTypeKey];
                    var driverName = driver._driver;
                    this[driverTypeKey] = driverName;

                    if (!DefinedDrivers[driverName]) {
                        // we don't need to wait for the promise,
                        // since the default drivers can be defined
                        // in a blocking manner
                        this.defineDriver(driver);
                    }
                }
            }

            this._defaultConfig = extend({}, DefaultConfig);
            this._config = extend({}, this._defaultConfig, options);
            this._driverSet = null;
            this._initDriver = null;
            this._ready = false;
            this._dbInfo = null;

            this._wrapLibraryMethodsWithReady();
            this.setDriver(this._config.driver)["catch"](function () {});
        }

        // Set any config values for localForage; can be called anytime before
        // the first API call (e.g. `getItem`, `setItem`).
        // We loop through options so we don't overwrite existing config
        // values.


        LocalForage.prototype.config = function config(options) {
            // If the options argument is an object, we use it to set values.
            // Otherwise, we return either a specified config value or all
            // config values.
            if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
                // If localforage is ready and fully initialized, we can't set
                // any new configuration values. Instead, we return an error.
                if (this._ready) {
                    return new Error("Can't call config() after localforage " + 'has been used.');
                }

                for (var i in options) {
                    if (i === 'storeName') {
                        options[i] = options[i].replace(/\W/g, '_');
                    }

                    if (i === 'version' && typeof options[i] !== 'number') {
                        return new Error('Database version must be a number.');
                    }

                    this._config[i] = options[i];
                }

                // after all config options are set and
                // the driver option is used, try setting it
                if ('driver' in options && options.driver) {
                    return this.setDriver(this._config.driver);
                }

                return true;
            } else if (typeof options === 'string') {
                return this._config[options];
            } else {
                return this._config;
            }
        };

        // Used to define a custom driver, shared across all instances of
        // localForage.


        LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
            var promise = new Promise$1(function (resolve, reject) {
                try {
                    var driverName = driverObject._driver;
                    var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

                    // A driver name should be defined and not overlap with the
                    // library-defined, default drivers.
                    if (!driverObject._driver) {
                        reject(complianceError);
                        return;
                    }

                    var driverMethods = LibraryMethods.concat('_initStorage');
                    for (var i = 0, len = driverMethods.length; i < len; i++) {
                        var driverMethodName = driverMethods[i];

                        // when the property is there,
                        // it should be a method even when optional
                        var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                        if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
                            reject(complianceError);
                            return;
                        }
                    }

                    var configureMissingMethods = function configureMissingMethods() {
                        var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                            return function () {
                                var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
                                var promise = Promise$1.reject(error);
                                executeCallback(promise, arguments[arguments.length - 1]);
                                return promise;
                            };
                        };

                        for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                            var optionalDriverMethod = OptionalDriverMethods[_i];
                            if (!driverObject[optionalDriverMethod]) {
                                driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                            }
                        }
                    };

                    configureMissingMethods();

                    var setDriverSupport = function setDriverSupport(support) {
                        if (DefinedDrivers[driverName]) {
                            console.info('Redefining LocalForage driver: ' + driverName);
                        }
                        DefinedDrivers[driverName] = driverObject;
                        DriverSupport[driverName] = support;
                        // don't use a then, so that we can define
                        // drivers that have simple _support methods
                        // in a blocking manner
                        resolve();
                    };

                    if ('_support' in driverObject) {
                        if (driverObject._support && typeof driverObject._support === 'function') {
                            driverObject._support().then(setDriverSupport, reject);
                        } else {
                            setDriverSupport(!!driverObject._support);
                        }
                    } else {
                        setDriverSupport(true);
                    }
                } catch (e) {
                    reject(e);
                }
            });

            executeTwoCallbacks(promise, callback, errorCallback);
            return promise;
        };

        LocalForage.prototype.driver = function driver() {
            return this._driver || null;
        };

        LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
            var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

            executeTwoCallbacks(getDriverPromise, callback, errorCallback);
            return getDriverPromise;
        };

        LocalForage.prototype.getSerializer = function getSerializer(callback) {
            var serializerPromise = Promise$1.resolve(localforageSerializer);
            executeTwoCallbacks(serializerPromise, callback);
            return serializerPromise;
        };

        LocalForage.prototype.ready = function ready(callback) {
            var self = this;

            var promise = self._driverSet.then(function () {
                if (self._ready === null) {
                    self._ready = self._initDriver();
                }

                return self._ready;
            });

            executeTwoCallbacks(promise, callback, callback);
            return promise;
        };

        LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
            var self = this;

            if (!isArray(drivers)) {
                drivers = [drivers];
            }

            var supportedDrivers = this._getSupportedDrivers(drivers);

            function setDriverToConfig() {
                self._config.driver = self.driver();
            }

            function extendSelfWithDriver(driver) {
                self._extend(driver);
                setDriverToConfig();

                self._ready = self._initStorage(self._config);
                return self._ready;
            }

            function initDriver(supportedDrivers) {
                return function () {
                    var currentDriverIndex = 0;

                    function driverPromiseLoop() {
                        while (currentDriverIndex < supportedDrivers.length) {
                            var driverName = supportedDrivers[currentDriverIndex];
                            currentDriverIndex++;

                            self._dbInfo = null;
                            self._ready = null;

                            return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                        }

                        setDriverToConfig();
                        var error = new Error('No available storage method found.');
                        self._driverSet = Promise$1.reject(error);
                        return self._driverSet;
                    }

                    return driverPromiseLoop();
                };
            }

            // There might be a driver initialization in progress
            // so wait for it to finish in order to avoid a possible
            // race condition to set _dbInfo
            var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
                return Promise$1.resolve();
            }) : Promise$1.resolve();

            this._driverSet = oldDriverSetDone.then(function () {
                var driverName = supportedDrivers[0];
                self._dbInfo = null;
                self._ready = null;

                return self.getDriver(driverName).then(function (driver) {
                    self._driver = driver._driver;
                    setDriverToConfig();
                    self._wrapLibraryMethodsWithReady();
                    self._initDriver = initDriver(supportedDrivers);
                });
            })["catch"](function () {
                setDriverToConfig();
                var error = new Error('No available storage method found.');
                self._driverSet = Promise$1.reject(error);
                return self._driverSet;
            });

            executeTwoCallbacks(this._driverSet, callback, errorCallback);
            return this._driverSet;
        };

        LocalForage.prototype.supports = function supports(driverName) {
            return !!DriverSupport[driverName];
        };

        LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
            extend(this, libraryMethodsAndProperties);
        };

        LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
            var supportedDrivers = [];
            for (var i = 0, len = drivers.length; i < len; i++) {
                var driverName = drivers[i];
                if (this.supports(driverName)) {
                    supportedDrivers.push(driverName);
                }
            }
            return supportedDrivers;
        };

        LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
            // Add a stub for each driver API method that delays the call to the
            // corresponding driver method until localForage is ready. These stubs
            // will be replaced by the driver methods as soon as the driver is
            // loaded, so there is no performance impact.
            for (var i = 0, len = LibraryMethods.length; i < len; i++) {
                callWhenReady(this, LibraryMethods[i]);
            }
        };

        LocalForage.prototype.createInstance = function createInstance(options) {
            return new LocalForage(options);
        };

        return LocalForage;
    }();

    // The actual localForage object that we expose as a module or via a
    // global. It's extended by pulling in one of our other libraries.


    var localforage_js = new LocalForage();

    module.exports = localforage_js;

    },{"3":3}]},{},[4])(4)
    });
    });

    const PREFIX_KEY = "SCR_ROUTER_";
    const IDX_DB_NAME = PREFIX_KEY;
    const IDX_DB_STORE = PREFIX_KEY;
    const EXPIRE_KEYS = `${PREFIX_KEY}IDX_DB_P_EXPIRE_KEYS`;

    localforage.config({
      driver: localforage.INDEXEDDB,
      name: IDX_DB_NAME,
      version: `${PREFIX_KEY}VERSION`,
      storeName: IDX_DB_STORE,
      description: `${PREFIX_KEY}DB_DESCRIPTOR`,
    });

    const LF = localforage;

    const getItem = async (key) => {
      try {
        await removeExpiredKeys();
        return fromJSON(await LF.getItem(key));
      } catch (error) {
        throw error;
      }
    };

    const setItem = async (key, value, time) => {
      try {
        if (key === undefined || key === null || key.trim() === "") {
          return false;
        }
        if (value === undefined || value === null) {
          await clearKeyList([key]);
          return;
        }
        await removeExpiredKeys();
        if (
          time &&
          Number.isSafeInteger(time) &&
          Number.isInteger(time) &&
          time > 0
        ) {
          await addExpireKey(key, time);
        }
        await LF.setItem(key, toJSON(value));
      } catch (error) {
        throw error;
      }
    };

    const removeItem = async (key) => {
      try {
        await removeExpiredKeys();
        const item = fromJSON(await LF.getItem(key));
        if (item !== null && item !== undefined) {
          await LF.removeItem(key);
          await removeExpireKey(key);
        }
        return item;
      } catch (error) {
        throw error;
      }
    };

    const getAll = async () => {
      try {
        await removeExpiredKeys();
        const keys = await LF.keys();
        const items = [];
        let item;
        for (let key of keys) {
          items.push(await LF.getItem(key));
          await LF.removeItem(key);
        }
        return items;
      } catch (error) {
        throw error;
      }
    };

    // clear all the expiration list and the keys
    const clearExpireKeys = async () => {
      try {
        const expire = fromJSON(await LF.getItem(EXPIRE_KEYS));

        if (expire === null || expire === undefined) {
          return;
        }

        await expire.map(async (item) => await LF.removeItem(item.key));

        await LF.removeItem(EXPIRE_KEYS);
      } catch (error) {
        throw error;
      }
    };

    // clear a given array list of keys
    // affects expiration key list and the keys
    const clearKeyList = async (keyList) => {
      try {
        if (!Array.isArray(keyList) || keyList.length === 0) {
          return;
        }

        await keyList.map(async (key) => {
          if (await LF.getItem(key)) {
            await LF.removeItem(key);
            await removeExpireKey(key);
          }
        });

        // updating the remaining list keychain if it has left any item
        let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));
        if (expire === null || expire === undefined) {
          return;
        }

        expire = expire.filter((item) => !keyList.includes(item.key));
        if (expire.length > 0) {
          await LF.setItem(EXPIRE_KEYS, toJSON(expire));
        } else {
          await LF.removeItem(EXPIRE_KEYS);
        }
      } catch (error) {
        throw error;
      }
    };

    // Function to check and remove a key if expired
    // If so... remove the key from the expiration list and the key
    const removeExpiredKeys = async () => {
      try {
        let keyList = [];
        let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));

        if (expire && expire.length > 0) {
          expire = await expire.filter(async (item) => {
            if (
              isBefore(new Date(), new Date(item.liveUntil)) &&
              (await LF.getItem(item.key))
            ) {
              return true;
            }
            await LF.removeItem(item.key);
            keyList.push(item.key);
          });

          if (expire.length > 0) {
            await LF.setItem(EXPIRE_KEYS, toJSON(expire));
          } else {
            await LF.removeItem(EXPIRE_KEYS);
          }
        }
        return keyList;
      } catch (error) {
        throw error;
      }
    };

    const setSvelteStoreInStorage = async (
      subscribe,
      key,
      timeout,
      ignoreKeys = []
    ) => {
      try {
        const unsubscribe = subscribe(async (store) => {
          for (let iKeys of ignoreKeys) {
            store[iKeys] = undefined;
          }
          await setItem(key, store, timeout);
        });
        unsubscribe();
      } catch (error) {
        throw error;
      }
    };

    const getSvelteStoreInStorage = async (update, key) => {
      try {
        const storage = await getItem(key);
        if (!storage) {
          return;
        }
        update(() => {
          return Object.assign({}, cloneDeep_1(storage));
        });
      } catch (error) {
        throw error;
      }
    };

    // ------------------------------------------------- ## BELOW THIS LINE PRIVATE FUNCTIONS ONLY ## -------------------------------------------------
    // add a key in the expiration key list
    // key: String
    // time: In milliseconds
    async function addExpireKey(key, time) {
      try {
        if (!Number.isInteger(time) || !Number.isSafeInteger(time)) {
          throw new Error("Time to add an expire key is not a safe integer");
        }

        let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));
        const liveUntil = addMilliseconds(new Date(), time);

        if (expire !== null && expire !== undefined) {
          expire = expire.filter((item) => item.key !== key);
          expire.push({ key, liveUntil });
        } else {
          expire = [{ key, liveUntil }];
        }

        await LF.setItem(EXPIRE_KEYS, toJSON(expire));
      } catch (error) {
        throw error;
      }
    }

    // removes a specific key from expiration key list, may remove the key too
    // key: String
    // expireKeyOnly: Boolean -- only = true for only remove from expireKey OR the key itself too
    async function removeExpireKey(key, expireKeyOnly = true) {
      try {
        let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));
        if (expire === null || expire === undefined) {
          return;
        }

        expire = expire.filter((item) => item.key !== key);

        if (expire.length > 0) {
          await LF.setItem(EXPIRE_KEYS, toJSON(expire));
        } else {
          await LF.removeItem(EXPIRE_KEYS);
        }

        if (!expireKeyOnly && LF.getItem(key)) {
          await LF.removeItem(key);
        }
      } catch (error) {
        throw error;
      }
    }

    function toJSON(item) {
      if (typeof item === "object") {
        return JSON.stringify(item);
      }
      return item;
    }

    function fromJSON(item) {
      if (!item) {
        return item;
      }
      try {
        return JSON.parse(item);
      } catch (err) {
        return item;
      }
    }

    // setInterval(removeExpiredKeys, 5000);

    var LF$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        getAll: getAll,
        clearExpireKeys: clearExpireKeys,
        clearKeyList: clearKeyList,
        removeExpiredKeys: removeExpiredKeys,
        setSvelteStoreInStorage: setSvelteStoreInStorage,
        getSvelteStoreInStorage: getSvelteStoreInStorage
    });

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const storeTemplate$2 = {
      hashMode: false,
      navigationHistoryLimit: 10,
      saveMode: "localstorage",
      notFoundRoute: "/notFound",
      errorRoute: "/error",
      consoleLogErrorMessages: true,
      consoleLogStores: true,
      usesRouteLayout: true,
      considerTrailingSlashOnMatchingRoute: true,
      useScroll: false,
      scrollProps: {
        top: 0,
        left: 0,
        behavior: "smooth",
        timeout: 10,
      },
    };

    const ENUM_SAVE_MODE = ["localstorage", "indexeddb", "none"];

    const store$2 = writable(assign({}, storeTemplate$2));
    let onError;
    let beforeEnter;

    // --------------  config Property  -----------------------------------------------------

    function setConfig(config) {
      setHashMode(config.hashMode);
      setNavigationHistoryLimit(config.navigationHistoryLimit);
      setSaveMode(config.saveMode);
      setNotFoundRoute(config.notFoundRoute);
      setErrorRoute(config.errorRoute);
      setConsoleLogErrorMessages(config.consoleLogErrorMessages);
      setConsoleLogStores(config.consoleLogStores);
      setUsesRouteLayout(config.usesRouteLayout);
      setConsiderTrailingSlashOnMatchingRoute(
        config.considerTrailingSlashOnMatchingRoute
      );
      setOnError(config.onError);
      setBeforeEnter(config.beforeEnter);
      setScrollProps(config.scrollProps);
      setUseScroll(config.useScroll);
    }

    function getConfig$2() {
      return getStoreState(store$2);
    }

    // --------------------------------------------------------------------------------------
    // --------------  hashmode Property  ---------------------------------------------------

    function setHashMode(hashMode) {
      if (typeof hashMode == "boolean") {
        updateStoreKey(store$2, { hashMode });
      }
    }

    function getHashMode() {
      return getStoreKey(store$2, "hashMode");
    }

    // --------------------------------------------------------------------------------------
    // --------------  navigationHistoryLimit Property  -------------------------------------

    function setNavigationHistoryLimit(navigationHistoryLimit) {
      if (typeof navigationHistoryLimit == "number") {
        updateStoreKey(store$2, { navigationHistoryLimit });
      }
    }

    function getNavigationHistoryLimit() {
      return getStoreKey(store$2, "navigationHistoryLimit");
    }

    // --------------------------------------------------------------------------------------
    // --------------  saveMode Property  ---------------------------------------------------

    function setSaveMode(saveMode) {
      if (ENUM_SAVE_MODE.includes(saveMode)) {
        updateStoreKey(store$2, { saveMode });
      }
    }

    function getSaveMode() {
      return getStoreKey(store$2, "saveMode");
    }

    // --------------------------------------------------------------------------------------
    // --------------  notFoundRoute Property  ----------------------------------------------

    function setNotFoundRoute(notFoundRoute) {
      if (typeof notFoundRoute == "string" && notFoundRoute.includes("/")) {
        updateStoreKey(store$2, { notFoundRoute });
      }
    }

    function getNotFoundRoute() {
      return getStoreKey(store$2, "notFoundRoute");
    }

    // --------------------------------------------------------------------------------------
    // --------------  errorRoute Property  -------------------------------------------------

    function setErrorRoute(errorRoute) {
      if (typeof errorRoute == "string" && errorRoute.includes("/")) {
        updateStoreKey(store$2, { errorRoute });
      }
    }

    function getErrorRoute() {
      return getStoreKey(store$2, "errorRoute");
    }

    // --------------------------------------------------------------------------------------
    // --------------  consoleLogErrorMessages Property  ------------------------------------

    function setConsoleLogErrorMessages(consoleLogErrorMessages = false) {
      if (typeof consoleLogErrorMessages == "boolean") {
        updateStoreKey(store$2, { consoleLogErrorMessages });
      }
    }

    function getConsoleLogErrorMessages() {
      return getStoreKey(store$2, "consoleLogErrorMessages");
    }

    // --------------------------------------------------------------------------------------
    // --------------  consoleLogStores Property  ------------------------------------

    function setConsoleLogStores(consoleLogStores = false) {
      if (typeof consoleLogStores == "boolean") {
        updateStoreKey(store$2, { consoleLogStores });
      }
    }

    function getConsoleLogStores() {
      return getStoreKey(store$2, "consoleLogStores");
    }

    // --------------------------------------------------------------------------------------
    // --------------  usesRouteLayout Property  --------------------------------------------

    function setUsesRouteLayout(usesRouteLayout) {
      if (typeof usesRouteLayout == "boolean") {
        updateStoreKey(store$2, { usesRouteLayout });
      }
    }

    function getUsesRouteLayout() {
      return getStoreKey(store$2, "usesRouteLayout");
    }

    // --------------------------------------------------------------------------------------
    // --------------  considerTrailingSlashOnMachingRoute Property  ------------------------

    function setConsiderTrailingSlashOnMachingRoute(
      considerTrailingSlashOnMachingRoute
    ) {
      if (typeof considerTrailingSlashOnMachingRoute == "boolean") {
        updateStoreKey(store$2, { considerTrailingSlashOnMachingRoute });
      }
    }

    function getConsiderTrailingSlashOnMachingRoute() {
      return getStoreKey(store$2, "considerTrailingSlashOnMachingRoute");
    }

    // --------------------------------------------------------------------------------------
    // --------------  scrollProps Property  ------------------------------------------------

    function setScrollProps(scrollProps) {
      if (typeof setScrollProps == "object") {
        ({
          top: scrollProps.top,
          left: scrollProps.left,
          behavior: scrollProps.behavior,
          timeout:
            scrollProps.timeout && scrollProps.timeout > 10
              ? scrollProps.timeout
              : 10,
        });
        updateStoreKey(store$2, { scrollProps });
      }
    }

    function getScrollProps() {
      return getStoreKey(store$2, "scrollProps");
    }

    // --------------------------------------------------------------------------------------
    // --------------  useScroll Property  --------------------------------------------------

    function setUseScroll(useScroll) {
      if (typeof useScroll == "boolean") {
        updateStoreKey(store$2, { useScroll });
      }
    }

    function getUseScroll() {
      return getStoreKey(store$2, "useScroll");
    }

    // --------------------------------------------------------------------------------------
    // --------------  onError Function  ----------------------------------------------------

    function setOnError(onErrorParam) {
      if (!onErrorParam || typeof onErrorParam !== "function") {
        return;
      }
      onError = onErrorParam;
    }

    function getOnError() {
      return onError;
    }

    // --------------------------------------------------------------------------------------
    // --------------  beforeEnter Function  --------------------------------------------

    function setBeforeEnter(beforeEnterParam) {
      if (
        !beforeEnterParam ||
        (typeof beforeEnterParam !== "function" && !Array.isArray(beforeEnterParam))
      ) {
        return;
      }
      if (Array.isArray(beforeEnterParam)) {
        for (let bFuncItem of beforeEnterParam) {
          if (typeof bFuncItem !== "function") {
            return;
          }
        }
      }
      // if is valid
      beforeEnter = beforeEnterParam;
    }

    function getBeforeEnter() {
      return beforeEnter;
    }

    // --------------------------------------------------------------------------------------

    var configStore = {
      subscribe: store$2.subscribe,
      update: store$2.update,
      setConfig,
      getConfig: getConfig$2,
      setHashMode,
      getHashMode,
      setNavigationHistoryLimit,
      getNavigationHistoryLimit,
      setSaveMode,
      getSaveMode,
      setNotFoundRoute,
      getNotFoundRoute,
      setErrorRoute,
      getErrorRoute,
      setConsoleLogErrorMessages,
      getConsoleLogErrorMessages,
      setConsoleLogStores,
      getConsoleLogStores,
      setUsesRouteLayout,
      getUsesRouteLayout,
      setConsiderTrailingSlashOnMachingRoute,
      getConsiderTrailingSlashOnMachingRoute,
      setScrollProps,
      getScrollProps,
      setUseScroll,
      getUseScroll,
      setOnError,
      getOnError,
      setBeforeEnter,
      getBeforeEnter,
    };

    const STORAGE_KEY = "SRC_ROUTER_STORE";

    const storeTemplate$1 = {
      routes: [],
      currentLocation: undefined,
      currentRoute: {
        name: undefined,
        pathname: undefined,
        params: [],
        hostname: undefined,
        protocol: undefined,
        port: undefined,
        origin: undefined,
        hash: undefined,
      },
      fromRoute: {
        name: undefined,
        pathname: undefined,
        params: [],
        hostname: undefined,
        protocol: undefined,
        port: undefined,
        origin: undefined,
        hash: undefined,
      },
      navigationHistory: [],
    };

    const store$1 = writable(assign({}, storeTemplate$1));

    // --------------  routes Property  ------------------------------------------------------

    async function setRoutes(routes = []) {
      if (!Array.isArray(routes)) {
        return;
      }
      updateStoreKey(store$1, { routes });
      await saveMode();
    }

    function getRoutes() {
      return getStoreKey(store$1, "routes");
    }

    // --------------------------------------------------------------------------------------
    // --------------  currentLocation Property  --------------------------------------------

    async function setCurrentLocation(currentLocation) {
      if (typeof currentLocation == "string") {
        updateStoreKey(store$1, { currentLocation });
        await saveMode();
      }
    }

    function getCurrentLocation() {
      return getStoreKey(store$1, "currentLocation");
    }

    // --------------------------------------------------------------------------------------
    // --------------  currentRoute Property  -----------------------------------------------

    async function setCurrentRoute(currentRoute) {
      if (typeof currentRoute == "object") {
        updateStoreKey(store$1, { currentRoute });
        await saveMode();
      }
    }

    function getCurrentRoute() {
      return getStoreKey(store$1, "currentRoute");
    }

    // --------------------------------------------------------------------------------------
    // --------------  fromRoute Property  --------------------------------------------------

    async function setFromRoute(fromRoute) {
      if (typeof fromRoute == "object") {
        updateStoreKey(store$1, { fromRoute });
        await saveMode();
      }
    }

    function getFromRoute() {
      return getStoreKey(store$1, "fromRoute");
    }

    // --------------------------------------------------------------------------------------
    // --------------  navigationHistory Property  ------------------------------------------

    async function setNavigationHistory(navigationHistory) {
      if (typeof navigationHistory == "object") {
        const configs = getConfig$1();
        if (configs.navigationHistoryLimit > 0) {
          navigationHistory = navigationHistory.slice(
            0,
            configs.navigationHistoryLimit - 1
          );
        }
        updateStoreKey(store$1, { navigationHistory });
        await saveMode();
      }
    }

    async function pushNavigationHistory(navObj) {
      let navigationHistory = getNavigationHistory$1() || [];
      navigationHistory = [navObj, ...navigationHistory];
      await setNavigationHistory(navigationHistory);
    }

    async function popNavigationHistory() {
      let navigationHistory = getNavigationHistory$1() || [];

      if (navigationHistory.length == 0) {
        return false;
      }
      const navObj = { ...navigationHistory[0] };
      await setNavigationHistory(navigationHistory.slice(1));
      return navObj;
    }

    function getNavigationHistory$1() {
      return getStoreKey(store$1, "navigationHistory");
    }

    // --------------------------------------------------------------------------------------
    // --------------  config Property  -----------------------------------------------------

    function getConfig$1() {
      return configStore.getConfig();
    }

    // --------------------------------------------------------------------------------------
    // --------------  saveMode Function  ---------------------------------------------------

    async function saveMode() {
      const configs = getConfig$1();
      if (!configs || !configs.saveMode || configs.saveMode == "none") {
        return false;
      }
      if (configs.saveMode === "localstorage") {
        await setSvelteStoreInStorage$1(store$1.subscribe, STORAGE_KEY);
      } else if (configs.saveMode === "indexeddb") {
        await setSvelteStoreInStorage(store$1.subscribe, STORAGE_KEY);
      }
      return false;
    }
    // --------------------------------------------------------------------------------------

    var routerStore = {
      subscribe: store$1.subscribe,
      update: store$1.update,
      STORAGE_KEY,
      setRoutes,
      getRoutes,
      setCurrentRoute,
      getCurrentRoute,
      setFromRoute,
      getFromRoute,
      setNavigationHistory,
      getNavigationHistory: getNavigationHistory$1,
      pushNavigationHistory,
      popNavigationHistory,
      setCurrentLocation,
      getCurrentLocation,
      getConfig: getConfig$1,
    };

    const storeTemplate = {
      pushRoute: false,
      params: {},
    };

    const store = writable(assign({}, storeTemplate));
    let routeNavigation;

    // --------------  pushRoute Property  --------------------------------------------------

    function pushRoute$1(route, params, onError) {
      if (!route) {
        const error = new Error(`SCR_ROUTER - Route not defined - ${route}`);
        if (typeof onError === "function") {
          onError(error);
        } else {
          throw error;
        }
      }
      const routes = routerStore.getRoutes();
      routeNavigation = undefined;

      if (typeof route === "string") {
        routeNavigation = routes.find((rItem) => rItem.path === route);
      } else if (route.path) {
        routeNavigation = routes.find((rItem) => rItem.path === route.path);
      } else if (route.name) {
        routeNavigation = routes.find((rItem) => rItem.name === route.name);
      }

      if (!routeNavigation) {
        routeNavigation = {
          notFound: true,
          path: typeof route === "string" ? route : route.path || "",
        };
      }

      if (onError && typeof onError === "function") {
        routeNavigation.onError = onError;
      }

      setParams(params);
      updateStoreKey(store, { pushRoute: true });
    }

    function consumeRoutePushed() {
      const copyRouteNavigation = assign({}, routeNavigation);
      routeNavigation = undefined;
      updateStoreKey(store, { pushRoute: false });
      copyRouteNavigation.params = {
        ...copyRouteNavigation.params,
        ...consumeParams(),
      };
      return copyRouteNavigation;
    }

    function backRoute$1() {
      const navigationHistory = getNavigationHistory();
      let popRoute;
      if (navigationHistory.length > 0) {
        popRoute = routerStore.popNavigationHistory();
      }
      window.history.back();
      return popRoute;
    }

    function getPushRoute() {
      return getStoreKey(store, "pushRoute");
    }

    // --------------------------------------------------------------------------------------
    // --------------  params Property  -----------------------------------------------------

    function setParams(params = {}) {
      updateStoreKey(store, { params });
    }

    function consumeParams() {
      const params = getStoreKey(store, "params");
      setParams();
      return params;
    }

    // --------------------------------------------------------------------------------------
    // --------------  navigationHistory Property  ------------------------------------------

    function getNavigationHistory() {
      return routerStore.getNavigationHistory();
    }

    // --------------------------------------------------------------------------------------
    // --------------  config Property  -----------------------------------------------------

    function getConfig() {
      return configStore.getConfig();
    }

    // --------------------------------------------------------------------------------------

    var navigateStore = {
      subscribe: store.subscribe,
      update: store.update,
      pushRoute: pushRoute$1,
      getPushRoute,
      consumeRoutePushed,
      backRoute: backRoute$1,
      getNavigationHistory,
      getConfig,
      setParams,
      consumeParams,
    };

    function loadingController() {
      this.resolveLoading = function () {
        if (this.resolveFunc) {
          this.resolveFunc(true);
          this.resolveFunc = undefined;
        }
      };
      this.startLoading = function () {
        this.callbackFunc = new Promise((resolve, reject) => {
          this.resolveFunc = resolve;
        });
        return this.callbackFunc;
      };
    }

    /* src/components/SCR_NotFound.svelte generated by Svelte v3.37.0 */
    const file$b = "src/components/SCR_NotFound.svelte";

    function create_fragment$d(ctx) {
    	let center;
    	let p0;
    	let t1;
    	let p1;
    	let t2_value = (/*$routerStore*/ ctx[0].currentLocation || "='(") + "";
    	let t2;

    	const block = {
    		c: function create() {
    			center = element("center");
    			p0 = element("p");
    			p0.textContent = "Not Found";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			attr_dev(p0, "class", "scr-p svelte-zj7cmj");
    			add_location(p0, file$b, 5, 2, 82);
    			attr_dev(p1, "class", "scr-p-small svelte-zj7cmj");
    			add_location(p1, file$b, 6, 2, 115);
    			add_location(center, file$b, 4, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, p0);
    			append_dev(center, t1);
    			append_dev(center, p1);
    			append_dev(p1, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$routerStore*/ 1 && t2_value !== (t2_value = (/*$routerStore*/ ctx[0].currentLocation || "='(") + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $routerStore;
    	validate_store(routerStore, "routerStore");
    	component_subscribe($$self, routerStore, $$value => $$invalidate(0, $routerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_NotFound", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ routerStore, $routerStore });
    	return [$routerStore];
    }

    class SCR_NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_NotFound",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/components/SCR_Loading.svelte generated by Svelte v3.37.0 */

    const { console: console_1$3 } = globals;
    const file$a = "src/components/SCR_Loading.svelte";

    function create_fragment$c(ctx) {
    	let center;
    	let div12;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let t7;
    	let div8;
    	let t8;
    	let div9;
    	let t9;
    	let div10;
    	let t10;
    	let div11;
    	let t11;
    	let h1;
    	let t12;

    	const block = {
    		c: function create() {
    			center = element("center");
    			div12 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			t8 = space();
    			div9 = element("div");
    			t9 = space();
    			div10 = element("div");
    			t10 = space();
    			div11 = element("div");
    			t11 = space();
    			h1 = element("h1");
    			t12 = text(/*loadingText*/ ctx[0]);
    			attr_dev(div0, "class", "svelte-146mxqr");
    			add_location(div0, file$a, 9, 4, 200);
    			attr_dev(div1, "class", "svelte-146mxqr");
    			add_location(div1, file$a, 10, 4, 212);
    			attr_dev(div2, "class", "svelte-146mxqr");
    			add_location(div2, file$a, 11, 4, 224);
    			attr_dev(div3, "class", "svelte-146mxqr");
    			add_location(div3, file$a, 12, 4, 236);
    			attr_dev(div4, "class", "svelte-146mxqr");
    			add_location(div4, file$a, 13, 4, 248);
    			attr_dev(div5, "class", "svelte-146mxqr");
    			add_location(div5, file$a, 14, 4, 260);
    			attr_dev(div6, "class", "svelte-146mxqr");
    			add_location(div6, file$a, 15, 4, 272);
    			attr_dev(div7, "class", "svelte-146mxqr");
    			add_location(div7, file$a, 16, 4, 284);
    			attr_dev(div8, "class", "svelte-146mxqr");
    			add_location(div8, file$a, 17, 4, 296);
    			attr_dev(div9, "class", "svelte-146mxqr");
    			add_location(div9, file$a, 18, 4, 308);
    			attr_dev(div10, "class", "svelte-146mxqr");
    			add_location(div10, file$a, 19, 4, 320);
    			attr_dev(div11, "class", "svelte-146mxqr");
    			add_location(div11, file$a, 20, 4, 332);
    			attr_dev(div12, "class", "scr-lds-spinner svelte-146mxqr");
    			add_location(div12, file$a, 8, 2, 166);
    			attr_dev(h1, "class", "scr-h1 svelte-146mxqr");
    			add_location(h1, file$a, 22, 2, 351);
    			attr_dev(center, "class", "scr-center svelte-146mxqr");
    			add_location(center, file$a, 7, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, div12);
    			append_dev(div12, div0);
    			append_dev(div12, t0);
    			append_dev(div12, div1);
    			append_dev(div12, t1);
    			append_dev(div12, div2);
    			append_dev(div12, t2);
    			append_dev(div12, div3);
    			append_dev(div12, t3);
    			append_dev(div12, div4);
    			append_dev(div12, t4);
    			append_dev(div12, div5);
    			append_dev(div12, t5);
    			append_dev(div12, div6);
    			append_dev(div12, t6);
    			append_dev(div12, div7);
    			append_dev(div12, t7);
    			append_dev(div12, div8);
    			append_dev(div12, t8);
    			append_dev(div12, div9);
    			append_dev(div12, t9);
    			append_dev(div12, div10);
    			append_dev(div12, t10);
    			append_dev(div12, div11);
    			append_dev(center, t11);
    			append_dev(center, h1);
    			append_dev(h1, t12);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*loadingText*/ 1) set_data_dev(t12, /*loadingText*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Loading", slots, []);
    	let { loadingText = "Loading..." } = $$props;
    	let { myCustomParam } = $$props;
    	const writable_props = ["loadingText", "myCustomParam"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<SCR_Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("loadingText" in $$props) $$invalidate(0, loadingText = $$props.loadingText);
    		if ("myCustomParam" in $$props) $$invalidate(1, myCustomParam = $$props.myCustomParam);
    	};

    	$$self.$capture_state = () => ({ loadingText, myCustomParam });

    	$$self.$inject_state = $$props => {
    		if ("loadingText" in $$props) $$invalidate(0, loadingText = $$props.loadingText);
    		if ("myCustomParam" in $$props) $$invalidate(1, myCustomParam = $$props.myCustomParam);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*myCustomParam*/ 2) {
    			console.log("LOADING>>>", myCustomParam);
    		}
    	};

    	return [loadingText, myCustomParam];
    }

    class SCR_Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { loadingText: 0, myCustomParam: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Loading",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*myCustomParam*/ ctx[1] === undefined && !("myCustomParam" in props)) {
    			console_1$3.warn("<SCR_Loading> was created without expected prop 'myCustomParam'");
    		}
    	}

    	get loadingText() {
    		throw new Error("<SCR_Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadingText(value) {
    		throw new Error("<SCR_Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get myCustomParam() {
    		throw new Error("<SCR_Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set myCustomParam(value) {
    		throw new Error("<SCR_Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/SCR_Error.svelte generated by Svelte v3.37.0 */

    const file$9 = "src/components/SCR_Error.svelte";

    function create_fragment$b(ctx) {
    	let center;
    	let p0;
    	let t1;
    	let p1;
    	let t2;

    	const block = {
    		c: function create() {
    			center = element("center");
    			p0 = element("p");
    			p0.textContent = "Error";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(/*errorMessage*/ ctx[0]);
    			attr_dev(p0, "class", "scr-p svelte-jhjhwz");
    			add_location(p0, file$9, 5, 2, 84);
    			attr_dev(p1, "class", "scr-p-small svelte-jhjhwz");
    			add_location(p1, file$9, 6, 2, 113);
    			add_location(center, file$9, 4, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, p0);
    			append_dev(center, t1);
    			append_dev(center, p1);
    			append_dev(p1, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*errorMessage*/ 1) set_data_dev(t2, /*errorMessage*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Error", slots, []);
    	let { errorMessage = "An error has occured!" } = $$props;
    	const writable_props = ["errorMessage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Error> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("errorMessage" in $$props) $$invalidate(0, errorMessage = $$props.errorMessage);
    	};

    	$$self.$capture_state = () => ({ errorMessage });

    	$$self.$inject_state = $$props => {
    		if ("errorMessage" in $$props) $$invalidate(0, errorMessage = $$props.errorMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [errorMessage];
    }

    class SCR_Error extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { errorMessage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Error",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get errorMessage() {
    		throw new Error("<SCR_Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorMessage(value) {
    		throw new Error("<SCR_Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/SCR_Layout.svelte generated by Svelte v3.37.0 */

    const file$8 = "src/components/SCR_Layout.svelte";
    const get_scr_header_slot_changes$2 = dirty => ({});
    const get_scr_header_slot_context$2 = ctx => ({});

    // (2:26)      
    function fallback_block$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Svelte Client Router - Example Layout!";
    			attr_dev(h1, "class", "scr-main-layout__header svelte-1myuyum");
    			add_location(h1, file$8, 2, 4, 62);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(2:26)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let main;
    	let t;
    	let current;
    	const scr_header_slot_template = /*#slots*/ ctx[1].scr_header;
    	const scr_header_slot = create_slot(scr_header_slot_template, ctx, /*$$scope*/ ctx[0], get_scr_header_slot_context$2);
    	const scr_header_slot_or_fallback = scr_header_slot || fallback_block$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (scr_header_slot_or_fallback) scr_header_slot_or_fallback.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(main, "class", "scr-main-layout svelte-1myuyum");
    			add_location(main, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (scr_header_slot_or_fallback) {
    				scr_header_slot_or_fallback.m(main, null);
    			}

    			append_dev(main, t);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (scr_header_slot) {
    				if (scr_header_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(scr_header_slot, scr_header_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_scr_header_slot_changes$2, get_scr_header_slot_context$2);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_header_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_header_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (scr_header_slot_or_fallback) scr_header_slot_or_fallback.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Layout", slots, ['scr_header','default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class SCR_Layout$2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Layout",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/components/SCR_Router.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1$1, console: console_1$2 } = globals;

    // (1:0) <script>   // -----------------  Import Variables  ----------------------------------------------    import { onMount }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>   // -----------------  Import Variables  ----------------------------------------------    import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (527:0) {:then value}
    function create_then_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$configStore*/ ctx[1].usesRouteLayout && typeof /*layoutComponent*/ ctx[6] === "function") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(527:0) {:then value}",
    		ctx
    	});

    	return block;
    }

    // (532:2) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*currentComponent*/ ctx[4];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign$1(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*currentComponent*/ ctx[4])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(532:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (528:2) {#if $configStore.usesRouteLayout && typeof layoutComponent === "function"}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*layoutComponent*/ ctx[6];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$1] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign$1(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (dirty & /*$$scope, currentComponent, props*/ 67108884) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*layoutComponent*/ ctx[6])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(528:2) {#if $configStore.usesRouteLayout && typeof layoutComponent === \\\"function\\\"}",
    		ctx
    	});

    	return block;
    }

    // (529:4) <svelte:component this={layoutComponent} {...props}>
    function create_default_slot$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*currentComponent*/ ctx[4];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign$1(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*currentComponent*/ ctx[4])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(529:4) <svelte:component this={layoutComponent} {...props}>",
    		ctx
    	});

    	return block;
    }

    // (525:23)    <svelte:component this={loadingComponent}
    function create_pending_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*loadingProps*/ ctx[3], /*props*/ ctx[2]];
    	var switch_value = /*loadingComponent*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign$1(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*loadingProps, props*/ 12)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*loadingProps*/ 8 && get_spread_object(/*loadingProps*/ ctx[3]),
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*loadingComponent*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(525:23)    <svelte:component this={loadingComponent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 25,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*loadingPromise*/ ctx[5], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*loadingPromise*/ 32 && promise !== (promise = /*loadingPromise*/ ctx[5]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[25] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getBeforeEnterAsArray(beforeEnterFuncOrArr) {
    	if (!beforeEnterFuncOrArr) {
    		return [];
    	}

    	if (Array.isArray(beforeEnterFuncOrArr)) {
    		return beforeEnterFuncOrArr;
    	}

    	if (typeof beforeEnterFuncOrArr === "function") {
    		return [beforeEnterFuncOrArr];
    	}

    	return [];
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function getUrlParameter  --------------------------------------
    function getUrlParameter(url) {
    	let getParams = {};

    	url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    		getParams[key] = value;
    	});

    	return getParams;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $configStore;
    	let $routerStore;
    	let $navigateStore;
    	validate_store(configStore, "configStore");
    	component_subscribe($$self, configStore, $$value => $$invalidate(1, $configStore = $$value));
    	validate_store(routerStore, "routerStore");
    	component_subscribe($$self, routerStore, $$value => $$invalidate(13, $routerStore = $$value));
    	validate_store(navigateStore, "navigateStore");
    	component_subscribe($$self, navigateStore, $$value => $$invalidate(14, $navigateStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Router", slots, []);
    	let { routes } = $$props;
    	let { notFoundComponent = SCR_NotFound } = $$props;
    	let { errorComponent = SCR_Error } = $$props;
    	let { defaultLayoutComponent = SCR_Layout$2 } = $$props;
    	let { loadingComponent = SCR_Loading } = $$props;
    	let { allProps = {} } = $$props;
    	let { allLoadingProps = {} } = $$props;

    	// ------------------------------------------------------------------------------------
    	// -----------------  Local Variables  ------------------------------------------------
    	let props = {};

    	let loadingProps = {};
    	let currentComponent;
    	let currentLocation;
    	let loadingPromise;
    	let layoutComponent = defaultLayoutComponent;
    	let loadingController$1 = new loadingController();

    	// -----------------------------------------------------------------------------------
    	// -----------------  function pushRoute  --------------------------------------------
    	function pushRoute(route, popEvent = true) {
    		const routePath = ($configStore.hashMode ? "#" : "") + route;

    		if (history.pushState) {
    			history.pushState(null, null, routePath);
    		} else {
    			location.hash = routePath;
    		}

    		if (popEvent) {
    			window.dispatchEvent(new Event("popstate"));
    		}
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function getLocation  ------------------------------------------
    	function getLocation() {
    		let pathname = location.pathname;

    		if ($configStore.hashMode && location.hash) {
    			pathname = location.hash.slice(1);
    		}

    		currentLocation = {
    			pathname,
    			params: getUrlParameter(location.href),
    			hostname: location.hostname,
    			protocol: location.protocol,
    			port: location.port,
    			origin: location.origin,
    			hash: location.hash
    		};
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function getRouteParams  ---------------------------------------
    	function getRouteParams(routeObj, customParams) {
    		$$invalidate(2, props = {});

    		if (routeObj && routeObj.params) {
    			$$invalidate(2, props = {
    				payload: routeObj.payload,
    				...routeObj.params,
    				...assign({}, allProps)
    			});
    		}

    		$$invalidate(2, props = {
    			...props,
    			...customParams,
    			currentRoute: {
    				...currentLocation,
    				name: routeObj.name,
    				pathname: routeObj.path
    			},
    			fromRoute: $routerStore.fromRoute
    		});

    		return props;
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function setErrorComponent  ------------------------------------
    	function setErrorComponent(errorMessage, error, routeObj) {
    		$$invalidate(4, currentComponent = errorComponent);
    		getRouteParams(routeObj, { errorMessage });

    		if (error && $configStore.consoleLogErrorMessages) {
    			console.error(error);
    		}

    		return pushRoute($configStore.errorRoute, false);
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function loadRoute  --------------------------------------------
    	async function loadRoute(routeObj, isLoading = true) {
    		try {
    			getLocation();
    			$$invalidate(6, layoutComponent = false);

    			if (currentLocation.pathname === $configStore.errorRoute) {
    				$$invalidate(4, currentComponent = errorComponent);
    				return;
    			}

    			// searching route from routes definition if not defined
    			if (!routeObj) {
    				routeObj = $routerStore.routes.find(routeItem => routeItem.path == currentLocation.pathname || $configStore.considerTrailingSlashOnMatchingRoute && routeItem.path + "/" == currentLocation.pathname);
    			} else {
    				if (routeObj.notFound) {
    					await routerStore.setCurrentLocation(routeObj.path);
    					return pushRoute($configStore.notFoundRoute);
    				}
    			}

    			// route not found - must redirect to NOT FOUND
    			if (!routeObj) {
    				$$invalidate(4, currentComponent = notFoundComponent);

    				// if current pathname is different not found route definition
    				if (currentLocation.pathname != $configStore.notFoundRoute) {
    					await routerStore.setCurrentLocation(currentLocation.pathname);
    					return pushRoute($configStore.notFoundRoute);
    				}

    				return false;
    			}

    			// setting loading property
    			$$invalidate(5, loadingPromise = loadingController$1.startLoading());

    			$$invalidate(3, loadingProps = { ...assign({}, allLoadingProps) });

    			if (routeObj.loadingProps) {
    				$$invalidate(3, loadingProps = {
    					...loadingProps,
    					...routeObj.loadingProps
    				});
    			}

    			// no component were defined by the user
    			if (!routeObj.component && !routeObj.lazyLoadComponent) {
    				throw new Error(`No component defined for (${routeObj.name} - ${routeObj.path})!`);
    			}

    			await routerStore.setCurrentLocation(currentLocation.pathname);
    			const configBERs = configStore.getBeforeEnter();

    			// checking if the this route has beforeEnter functions to execute
    			if (!routeObj.beforeEnter && (!configBERs || routeObj.ignoreGlobalBeforeFunction)) {
    				return await finalizeRoute(routeObj, isLoading);
    			}

    			const beforeEnterRoute = getBeforeEnterAsArray(routeObj.beforeEnter);

    			// execute each beforeEnter function before finalizeRoute
    			// if is set to ignore global before functions
    			if (routeObj.ignoreGlobalBeforeFunction) {
    				await executeBeforeEnterFunctions(routeObj, beforeEnterRoute, isLoading);
    			} else {
    				// if executeRouteBEFBeforeGlobalBEF is set then must run routeBeforeEnter
    				// before globalBeforeEnter
    				const beforeEnterGlobal = getBeforeEnterAsArray(configBERs);

    				const beforeEnterArr = routeObj.executeRouteBEFBeforeGlobalBEF
    				? [...beforeEnterRoute, ...beforeEnterGlobal]
    				: [...beforeEnterGlobal, ...beforeEnterRoute];

    				await executeBeforeEnterFunctions(routeObj, beforeEnterArr, isLoading);
    			}
    		} catch(error) {
    			loadingController$1.resolveLoading();

    			if (configStore.getOnError()) {
    				configStore.getOnError()(error, getRouteParams(routeObj));
    			}

    			setErrorComponent(`SCR_ROUTER - ${error}!`, error, routeObj);
    		} finally {
    			loadingController$1.resolveLoading();
    		}
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function executeBeforeEnterFunctions  --------------------------
    	async function executeBeforeEnterFunctions(routeObj, beforeEnterArr, isLoading) {
    		// params passed down to the components and before execute functions
    		const routeFrom = assign({}, $routerStore.currentRoute);

    		const routeTo = assign({ name: routeObj.name }, currentLocation);

    		// response from beforeEnter function
    		// true - go ahead
    		// false - stop execution and remain where it is
    		// { redirect: "" } - redirect to somewhere else -- local
    		// { path: "" } - redirect to somewhere else -- local - base on route
    		// { name: "" } - redirect to somewhere else -- local - base on name
    		let resFunc;

    		// object merge params with custom route params defined
    		let routeObjParams;

    		routeObj.payload = {};

    		for (let bFunc of beforeEnterArr) {
    			// beforeEnter Function is not a function throw an error
    			if (!bFunc || typeof bFunc !== "function") {
    				throw new Error(`SCR_ROUTER - Before Enter Function of route (${routeObj.name} - ${routeObj.path}) is not a function!`);
    			}

    			// promisify each beforeEnter
    			resFunc = await new Promise(async (resolve, reject) => {
    					try {
    						// passing down the router params defined in the router object
    						routeObjParams = undefined;

    						if (routeObj.params) {
    							routeObjParams = { ...routeObj.params };
    						}

    						// executing beforeEnter Functions GLOBAL And Route Specific
    						await bFunc(resolve, routeFrom, routeTo, routeObjParams, routeObj.payload);

    						// reseting payload if destroyed
    						if (!routeObj.payload) {
    							routeObj.payload = {};

    							if ($configStore.consoleLogErrorMessages) {
    								console.warn("SCR_ROUTER - Payload property were redefined");
    							}
    						}

    						// updating props and passing to all components!
    						getRouteParams(routeObj);
    					} catch(error) {
    						resolve({ SCR_ROUTE_ERROR: true, error });
    					}
    				});

    			// continue to the next beforeEnter Function
    			if (resFunc === true) {
    				continue;
    			}

    			// stop execution
    			if (!resFunc) {
    				return pushRoute($routerStore.currentRoute.pathname);
    			}

    			if (resFunc.SCR_ROUTE_ERROR) {
    				// each route can define an error function and if it is defined... execute it
    				if (routeObj.onError && typeof routeObj.onError === "function") {
    					routeObj.onError(resFunc.error, getRouteParams(routeObj));
    					return setErrorComponent(`SCR_ROUTER - ${resFunc.error}!`, resFunc.error, routeObj);
    				} else {
    					// this will execute, if defined, global error of the router
    					throw new Error(`Error on route (${routeObj.name} - ${routeObj.path}) - ${error}!`);
    				}
    			}

    			// redirection defined by redirect or path
    			if (resFunc && (resFunc.redirect || resFunc.path)) {
    				return pushRoute(resFunc.redirect || resFunc.path);
    			}

    			// redirection defined by name
    			if (resFunc && resFunc.name) {
    				const findRoute = $routerStore.routes.find(rItem => rItem.name === resFunc.name);

    				// route name not found thrown error!
    				if (!findRoute) {
    					let notFoundRouteName = new Error(`Error not found route name (${resFunc.name})`);

    					if (routeObj.onError && typeof routeObj.onError === "function") {
    						routeObj.onError(notFoundRouteName, getRouteParams(routeObj));
    						return false;
    					} else {
    						throw notFoundRouteName;
    					}
    				}

    				return pushRoute(findRoute.path);
    			}
    		}

    		// finalizeRoute definitions
    		return await finalizeRoute(routeObj, isLoading);
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function finalizeRoute  ----------------------------------------
    	async function finalizeRoute(routeObj, isLoading = false) {
    		// setting route title if defined
    		if (routeObj.title) {
    			_freeGlobal.document.title = routeObj.title;
    		}

    		// updating store info
    		await routerStore.setFromRoute($routerStore.currentRoute);

    		await routerStore.pushNavigationHistory($routerStore.currentRoute);

    		if (!isLoading) {
    			await routerStore.setCurrentRoute({
    				pathname: routeObj.path,
    				params: { ...routeObj.params },
    				hostname: currentLocation.hostname,
    				protocol: currentLocation.protocol,
    				port: currentLocation.port,
    				origin: currentLocation.origin,
    				hash: currentLocation.hash,
    				name: routeObj.name
    			});
    		} else {
    			await routerStore.setCurrentRoute({ ...currentLocation, name: routeObj.name });
    		}

    		// setting component params
    		const routeParams = getRouteParams(routeObj);

    		// if user defined some action before finalizeRoute
    		if (routeObj.afterBeforeEnter && typeof routeObj.afterBeforeEnter === "function") {
    			routeObj.afterBeforeEnter(routeParams);
    		}

    		if ($configStore.usesRouteLayout && !routeObj.ignoreLayout) {
    			// if is lazy loading component layout component
    			if (typeof routeObj.lazyLoadLayoutComponent === "function") {
    				const loadedLayoutComponent = await routeObj.lazyLoadLayoutComponent();

    				if (loadedLayoutComponent && loadedLayoutComponent.default) {
    					$$invalidate(6, layoutComponent = loadedLayoutComponent.default);
    				} else {
    					throw new Error(`Lazy Load Layout Component defined for (${routeObj.name} - ${routeObj.path}) could not be loaded`);
    				}
    			} else if (routeObj.layoutComponent) {
    				$$invalidate(6, layoutComponent = routeObj.layoutComponent);
    			} else {
    				$$invalidate(6, layoutComponent = defaultLayoutComponent);
    			}
    		} else {
    			$$invalidate(6, layoutComponent = false);
    		}

    		// if is lazy loading component now is the time to load
    		if (typeof routeObj.lazyLoadComponent === "function") {
    			const loadedComponent = await routeObj.lazyLoadComponent();

    			if (loadedComponent && loadedComponent.default) {
    				$$invalidate(4, currentComponent = loadedComponent.default);
    			} else {
    				throw new Error(`Lazy Load Component defined for (${routeObj.name} - ${routeObj.path}) could not be loaded`);
    			}
    		}

    		loadingController$1.resolveLoading();

    		// scroll to position if enabled
    		if ($configStore.useScroll && !routeObj.ignoreScroll) {
    			let scrollProps = {
    				top: $configStore.scrollProps.top || 0,
    				left: $configStore.scrollProps.left || 0,
    				behavior: $configStore.scrollProps.behavior || "smooth",
    				timeout: $configStore.scrollProps.timeout || 10
    			};

    			if (routeObj.scrollProps) {
    				scrollProps.top = routeObj.scrollProps.top;
    				scrollProps.left = routeObj.scrollProps.left;
    				scrollProps.behavior = routeObj.scrollProps.behavior;
    				scrollProps.timeout = routeObj.scrollProps.timeout;
    			}

    			setTimeout(() => window.scrollTo(scrollProps), scrollProps.timeout);
    		}

    		return pushRoute(routeObj.path, false);
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function onMount  ----------------------------------------------
    	onMount(async () => {
    		// is to load from storages?
    		if ($configStore.saveMode === "localstorage") {
    			await getSvelteStoreInStorage$1(routerStore.update, routerStore.STORAGE_KEY);
    		} else if ($configStore.saveMode === "indexeddb") {
    			await getSvelteStoreInStorage(routerStore.update, routerStore.STORAGE_KEY);
    		}

    		// routes were set?
    		if (routes) {
    			await routerStore.setRoutes(routes);
    		}

    		// checking if any routes were set
    		if (!$routerStore.routes || $routerStore.routes.length == 0) {
    			const error = new Error("SCR_ROUTER - No routes were defined!");

    			if (configStore.getOnError()) {
    				configStore.getOnError()(error);
    			} else {
    				setErrorComponent(`SCR_ROUTER - ${error}!`, error);
    			}

    			$$invalidate(4, currentComponent = errorComponent);
    			return error;
    		}

    		// loading route
    		await loadRoute();
    	});

    	// -----------------------------------------------------------------------------------
    	// -----------------  Window - eventListener popstate  -------------------------------
    	window.addEventListener("popstate", async event => {
    		await loadRoute();
    	});

    	const writable_props = [
    		"routes",
    		"notFoundComponent",
    		"errorComponent",
    		"defaultLayoutComponent",
    		"loadingComponent",
    		"allProps",
    		"allLoadingProps"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<SCR_Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(7, routes = $$props.routes);
    		if ("notFoundComponent" in $$props) $$invalidate(8, notFoundComponent = $$props.notFoundComponent);
    		if ("errorComponent" in $$props) $$invalidate(9, errorComponent = $$props.errorComponent);
    		if ("defaultLayoutComponent" in $$props) $$invalidate(10, defaultLayoutComponent = $$props.defaultLayoutComponent);
    		if ("loadingComponent" in $$props) $$invalidate(0, loadingComponent = $$props.loadingComponent);
    		if ("allProps" in $$props) $$invalidate(11, allProps = $$props.allProps);
    		if ("allLoadingProps" in $$props) $$invalidate(12, allLoadingProps = $$props.allLoadingProps);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		assign,
    		LS: LS$1,
    		LF: LF$1,
    		configStore,
    		routerStore,
    		navigateStore,
    		LoadingController: loadingController,
    		SCR_NotFound,
    		SCR_Loading,
    		SCR_Error,
    		SCR_Layout: SCR_Layout$2,
    		document: _freeGlobal.document,
    		routes,
    		notFoundComponent,
    		errorComponent,
    		defaultLayoutComponent,
    		loadingComponent,
    		allProps,
    		allLoadingProps,
    		props,
    		loadingProps,
    		currentComponent,
    		currentLocation,
    		loadingPromise,
    		layoutComponent,
    		loadingController: loadingController$1,
    		getBeforeEnterAsArray,
    		pushRoute,
    		getUrlParameter,
    		getLocation,
    		getRouteParams,
    		setErrorComponent,
    		loadRoute,
    		executeBeforeEnterFunctions,
    		finalizeRoute,
    		$configStore,
    		$routerStore,
    		$navigateStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(7, routes = $$props.routes);
    		if ("notFoundComponent" in $$props) $$invalidate(8, notFoundComponent = $$props.notFoundComponent);
    		if ("errorComponent" in $$props) $$invalidate(9, errorComponent = $$props.errorComponent);
    		if ("defaultLayoutComponent" in $$props) $$invalidate(10, defaultLayoutComponent = $$props.defaultLayoutComponent);
    		if ("loadingComponent" in $$props) $$invalidate(0, loadingComponent = $$props.loadingComponent);
    		if ("allProps" in $$props) $$invalidate(11, allProps = $$props.allProps);
    		if ("allLoadingProps" in $$props) $$invalidate(12, allLoadingProps = $$props.allLoadingProps);
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("loadingProps" in $$props) $$invalidate(3, loadingProps = $$props.loadingProps);
    		if ("currentComponent" in $$props) $$invalidate(4, currentComponent = $$props.currentComponent);
    		if ("currentLocation" in $$props) currentLocation = $$props.currentLocation;
    		if ("loadingPromise" in $$props) $$invalidate(5, loadingPromise = $$props.loadingPromise);
    		if ("layoutComponent" in $$props) $$invalidate(6, layoutComponent = $$props.layoutComponent);
    		if ("loadingController" in $$props) loadingController$1 = $$props.loadingController;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$configStore, $routerStore*/ 8194) {
    			// -----------------------------------------------------------------------------------
    			// -----------------  svelte_reactive - $configStore.consoleLogStores  ---------------
    			if ($configStore.consoleLogStores) {
    				console.log($routerStore);
    				console.log($configStore);
    			}
    		}

    		if ($$self.$$.dirty & /*$navigateStore*/ 16384) {
    			// -----------------------------------------------------------------------------------
    			// -----------------  svelte_reactive - $navigateStore.pushRoute  --------------------
    			if ($navigateStore.pushRoute) {
    				loadRoute(navigateStore.consumeRoutePushed(), false);
    			}
    		}
    	};

    	return [
    		loadingComponent,
    		$configStore,
    		props,
    		loadingProps,
    		currentComponent,
    		loadingPromise,
    		layoutComponent,
    		routes,
    		notFoundComponent,
    		errorComponent,
    		defaultLayoutComponent,
    		allProps,
    		allLoadingProps,
    		$routerStore,
    		$navigateStore
    	];
    }

    class SCR_Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			routes: 7,
    			notFoundComponent: 8,
    			errorComponent: 9,
    			defaultLayoutComponent: 10,
    			loadingComponent: 0,
    			allProps: 11,
    			allLoadingProps: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Router",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*routes*/ ctx[7] === undefined && !("routes" in props)) {
    			console_1$2.warn("<SCR_Router> was created without expected prop 'routes'");
    		}
    	}

    	get routes() {
    		throw new Error_1$1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1$1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notFoundComponent() {
    		throw new Error_1$1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notFoundComponent(value) {
    		throw new Error_1$1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errorComponent() {
    		throw new Error_1$1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorComponent(value) {
    		throw new Error_1$1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultLayoutComponent() {
    		throw new Error_1$1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultLayoutComponent(value) {
    		throw new Error_1$1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadingComponent() {
    		throw new Error_1$1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadingComponent(value) {
    		throw new Error_1$1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allProps() {
    		throw new Error_1$1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allProps(value) {
    		throw new Error_1$1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allLoadingProps() {
    		throw new Error_1$1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allLoadingProps(value) {
    		throw new Error_1$1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/SCR_RouterLink.svelte generated by Svelte v3.37.0 */
    const file$7 = "src/components/SCR_RouterLink.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*elementProps*/ ctx[0]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign$1(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$7, 17, 0, 350);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onClick*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*elementProps*/ 1 && /*elementProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_RouterLink", slots, ['default']);
    	let { props = {} } = $$props;
    	let { onError } = $$props;
    	let { to } = $$props;
    	let { elementProps } = $$props;

    	function onClick() {
    		if (!to) {
    			alert("SCR_ROUTERLINK Component\n- to property is not defined");
    			return;
    		}

    		navigateStore.pushRoute(to, props, onError);
    	}

    	const writable_props = ["props", "onError", "to", "elementProps"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouterLink> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("onError" in $$props) $$invalidate(3, onError = $$props.onError);
    		if ("to" in $$props) $$invalidate(4, to = $$props.to);
    		if ("elementProps" in $$props) $$invalidate(0, elementProps = $$props.elementProps);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		navigateStore,
    		props,
    		onError,
    		to,
    		elementProps,
    		onClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("onError" in $$props) $$invalidate(3, onError = $$props.onError);
    		if ("to" in $$props) $$invalidate(4, to = $$props.to);
    		if ("elementProps" in $$props) $$invalidate(0, elementProps = $$props.elementProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [elementProps, onClick, props, onError, to, $$scope, slots];
    }

    class SCR_RouterLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			props: 2,
    			onError: 3,
    			to: 4,
    			elementProps: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouterLink",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onError*/ ctx[3] === undefined && !("onError" in props)) {
    			console.warn("<SCR_RouterLink> was created without expected prop 'onError'");
    		}

    		if (/*to*/ ctx[4] === undefined && !("to" in props)) {
    			console.warn("<SCR_RouterLink> was created without expected prop 'to'");
    		}

    		if (/*elementProps*/ ctx[0] === undefined && !("elementProps" in props)) {
    			console.warn("<SCR_RouterLink> was created without expected prop 'elementProps'");
    		}
    	}

    	get props() {
    		throw new Error("<SCR_RouterLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set props(value) {
    		throw new Error("<SCR_RouterLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onError() {
    		throw new Error("<SCR_RouterLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onError(value) {
    		throw new Error("<SCR_RouterLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get to() {
    		throw new Error("<SCR_RouterLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<SCR_RouterLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get elementProps() {
    		throw new Error("<SCR_RouterLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set elementProps(value) {
    		throw new Error("<SCR_RouterLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const SCR_ROUTER_COMPONENT = SCR_Router;
    const SCR_ROUTER_LINK = SCR_RouterLink;
    const SCR_CONFIG_STORE = configStore;
    const pushRoute = navigateStore.pushRoute;
    const backRoute = navigateStore.backRoute;

    /* src/testComponents/SCR_C1.svelte generated by Svelte v3.37.0 */

    const file$6 = "src/testComponents/SCR_C1.svelte";

    function create_fragment$7(ctx) {
    	let main;

    	const block = {
    		c: function create() {
    			main = element("main");
    			main.textContent = "C1";
    			attr_dev(main, "class", "svelte-1gmv5eg");
    			add_location(main, file$6, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_C1", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_C1> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SCR_C1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_C1",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/testComponents/SCR_C4.svelte generated by Svelte v3.37.0 */

    const { console: console_1$1 } = globals;
    const file$5 = "src/testComponents/SCR_C4.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let span0;
    	let t3;
    	let br0;
    	let t4;
    	let blockquote0;
    	let pre0;
    	let t5_value = JSON.stringify(/*payload*/ ctx[0]) + "";
    	let t5;
    	let t6;
    	let br1;
    	let t7;
    	let span1;
    	let t9;
    	let br2;
    	let t10;
    	let blockquote1;
    	let pre1;
    	let t11_value = JSON.stringify(/*currentRoute*/ ctx[1]) + "";
    	let t11;
    	let t12;
    	let br3;
    	let t13;
    	let span2;
    	let t15;
    	let br4;
    	let t16;
    	let blockquote2;
    	let pre2;
    	let t17_value = JSON.stringify(/*fromRoute*/ ctx[2]) + "";
    	let t17;
    	let t18;
    	let br5;
    	let t19;
    	let button0;
    	let t21;
    	let button1;
    	let t23;
    	let button2;
    	let t25;
    	let button3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Component Four";
    			t1 = space();
    			span0 = element("span");
    			span0.textContent = "Params Defined on Route:";
    			t3 = space();
    			br0 = element("br");
    			t4 = space();
    			blockquote0 = element("blockquote");
    			pre0 = element("pre");
    			t5 = text(t5_value);
    			t6 = space();
    			br1 = element("br");
    			t7 = space();
    			span1 = element("span");
    			span1.textContent = "Current Route Object:";
    			t9 = space();
    			br2 = element("br");
    			t10 = space();
    			blockquote1 = element("blockquote");
    			pre1 = element("pre");
    			t11 = text(t11_value);
    			t12 = space();
    			br3 = element("br");
    			t13 = space();
    			span2 = element("span");
    			span2.textContent = "From Route Object:";
    			t15 = space();
    			br4 = element("br");
    			t16 = space();
    			blockquote2 = element("blockquote");
    			pre2 = element("pre");
    			t17 = text(t17_value);
    			t18 = space();
    			br5 = element("br");
    			t19 = space();
    			button0 = element("button");
    			button0.textContent = "Route One - GO!";
    			t21 = space();
    			button1 = element("button");
    			button1.textContent = "Route Two - GO!";
    			t23 = space();
    			button2 = element("button");
    			button2.textContent = "Route Three - GO!";
    			t25 = space();
    			button3 = element("button");
    			button3.textContent = "Route Five - GO!";
    			add_location(h2, file$5, 9, 2, 168);
    			add_location(span0, file$5, 10, 2, 194);
    			add_location(br0, file$5, 11, 2, 234);
    			add_location(pre0, file$5, 13, 4, 260);
    			add_location(blockquote0, file$5, 12, 2, 243);
    			add_location(br1, file$5, 17, 2, 329);
    			add_location(span1, file$5, 18, 2, 338);
    			add_location(br2, file$5, 19, 2, 375);
    			add_location(pre1, file$5, 21, 4, 401);
    			add_location(blockquote1, file$5, 20, 2, 384);
    			add_location(br3, file$5, 25, 2, 475);
    			add_location(span2, file$5, 26, 2, 484);
    			add_location(br4, file$5, 27, 2, 518);
    			add_location(pre2, file$5, 29, 4, 544);
    			add_location(blockquote2, file$5, 28, 2, 527);
    			add_location(br5, file$5, 33, 2, 615);
    			attr_dev(button0, "class", "scr-button svelte-ms9hc9");
    			add_location(button0, file$5, 34, 2, 624);
    			attr_dev(button1, "class", "scr-button svelte-ms9hc9");
    			add_location(button1, file$5, 40, 2, 753);
    			attr_dev(button2, "class", "scr-button svelte-ms9hc9");
    			add_location(button2, file$5, 46, 2, 882);
    			attr_dev(button3, "class", "scr-button svelte-ms9hc9");
    			add_location(button3, file$5, 52, 2, 1015);
    			attr_dev(main, "class", "svelte-ms9hc9");
    			add_location(main, file$5, 8, 0, 159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			append_dev(main, span0);
    			append_dev(main, t3);
    			append_dev(main, br0);
    			append_dev(main, t4);
    			append_dev(main, blockquote0);
    			append_dev(blockquote0, pre0);
    			append_dev(pre0, t5);
    			append_dev(main, t6);
    			append_dev(main, br1);
    			append_dev(main, t7);
    			append_dev(main, span1);
    			append_dev(main, t9);
    			append_dev(main, br2);
    			append_dev(main, t10);
    			append_dev(main, blockquote1);
    			append_dev(blockquote1, pre1);
    			append_dev(pre1, t11);
    			append_dev(main, t12);
    			append_dev(main, br3);
    			append_dev(main, t13);
    			append_dev(main, span2);
    			append_dev(main, t15);
    			append_dev(main, br4);
    			append_dev(main, t16);
    			append_dev(main, blockquote2);
    			append_dev(blockquote2, pre2);
    			append_dev(pre2, t17);
    			append_dev(main, t18);
    			append_dev(main, br5);
    			append_dev(main, t19);
    			append_dev(main, button0);
    			append_dev(main, t21);
    			append_dev(main, button1);
    			append_dev(main, t23);
    			append_dev(main, button2);
    			append_dev(main, t25);
    			append_dev(main, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*payload*/ 1 && t5_value !== (t5_value = JSON.stringify(/*payload*/ ctx[0]) + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*currentRoute*/ 2 && t11_value !== (t11_value = JSON.stringify(/*currentRoute*/ ctx[1]) + "")) set_data_dev(t11, t11_value);
    			if (dirty & /*fromRoute*/ 4 && t17_value !== (t17_value = JSON.stringify(/*fromRoute*/ ctx[2]) + "")) set_data_dev(t17, t17_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_C4", slots, []);
    	let { payload } = $$props;
    	let { currentRoute } = $$props;
    	let { fromRoute } = $$props;
    	console.log(payload);
    	const writable_props = ["payload", "currentRoute", "fromRoute"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<SCR_C4> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pushRoute({ name: "routeOne" });
    	};

    	const click_handler_1 = () => {
    		pushRoute({ name: "routeTwo" });
    	};

    	const click_handler_2 = () => {
    		pushRoute({ name: "routeThree" });
    	};

    	const click_handler_3 = () => {
    		pushRoute({ name: "routeFive" });
    	};

    	$$self.$$set = $$props => {
    		if ("payload" in $$props) $$invalidate(0, payload = $$props.payload);
    		if ("currentRoute" in $$props) $$invalidate(1, currentRoute = $$props.currentRoute);
    		if ("fromRoute" in $$props) $$invalidate(2, fromRoute = $$props.fromRoute);
    	};

    	$$self.$capture_state = () => ({
    		pushRoute,
    		payload,
    		currentRoute,
    		fromRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ("payload" in $$props) $$invalidate(0, payload = $$props.payload);
    		if ("currentRoute" in $$props) $$invalidate(1, currentRoute = $$props.currentRoute);
    		if ("fromRoute" in $$props) $$invalidate(2, fromRoute = $$props.fromRoute);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		payload,
    		currentRoute,
    		fromRoute,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class SCR_C4 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			payload: 0,
    			currentRoute: 1,
    			fromRoute: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_C4",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*payload*/ ctx[0] === undefined && !("payload" in props)) {
    			console_1$1.warn("<SCR_C4> was created without expected prop 'payload'");
    		}

    		if (/*currentRoute*/ ctx[1] === undefined && !("currentRoute" in props)) {
    			console_1$1.warn("<SCR_C4> was created without expected prop 'currentRoute'");
    		}

    		if (/*fromRoute*/ ctx[2] === undefined && !("fromRoute" in props)) {
    			console_1$1.warn("<SCR_C4> was created without expected prop 'fromRoute'");
    		}
    	}

    	get payload() {
    		throw new Error("<SCR_C4>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set payload(value) {
    		throw new Error("<SCR_C4>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentRoute() {
    		throw new Error("<SCR_C4>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<SCR_C4>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fromRoute() {
    		throw new Error("<SCR_C4>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fromRoute(value) {
    		throw new Error("<SCR_C4>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SCR_C4$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_C4
    });

    /* src/testComponents/SCR_Layout_Global.svelte generated by Svelte v3.37.0 */

    const file$4 = "src/testComponents/SCR_Layout_Global.svelte";
    const get_scr_header_slot_changes$1 = dirty => ({});
    const get_scr_header_slot_context$1 = ctx => ({});

    // (2:26)      
    function fallback_block$1(ctx) {
    	let h1;
    	let t0;
    	let br;
    	let t1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Svelte Client Router ");
    			br = element("br");
    			t1 = text(" Custom Global Example Layout!");
    			add_location(br, file$4, 3, 27, 126);
    			attr_dev(h1, "class", "scr-main-layout__header svelte-ww5h5s");
    			add_location(h1, file$4, 2, 4, 62);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, br);
    			append_dev(h1, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(2:26)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let t;
    	let current;
    	const scr_header_slot_template = /*#slots*/ ctx[1].scr_header;
    	const scr_header_slot = create_slot(scr_header_slot_template, ctx, /*$$scope*/ ctx[0], get_scr_header_slot_context$1);
    	const scr_header_slot_or_fallback = scr_header_slot || fallback_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (scr_header_slot_or_fallback) scr_header_slot_or_fallback.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(main, "class", "scr-main-layout svelte-ww5h5s");
    			add_location(main, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (scr_header_slot_or_fallback) {
    				scr_header_slot_or_fallback.m(main, null);
    			}

    			append_dev(main, t);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (scr_header_slot) {
    				if (scr_header_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(scr_header_slot, scr_header_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_scr_header_slot_changes$1, get_scr_header_slot_context$1);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_header_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_header_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (scr_header_slot_or_fallback) scr_header_slot_or_fallback.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Layout_Global", slots, ['scr_header','default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Layout_Global> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class SCR_Layout_Global extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Layout_Global",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    var SCR_Layout_Global$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_Layout_Global
    });

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1, console: console_1 } = globals;

    function create_fragment$4(ctx) {
    	let scr_router_component;
    	let updating_routes;
    	let current;

    	function scr_router_component_routes_binding(value) {
    		/*scr_router_component_routes_binding*/ ctx[1](value);
    	}

    	let scr_router_component_props = {
    		defaultLayoutComponent: SCR_Layout_Global,
    		allProps: { allPropsTest: "Passing To ALL" }
    	};

    	if (/*routes*/ ctx[0] !== void 0) {
    		scr_router_component_props.routes = /*routes*/ ctx[0];
    	}

    	scr_router_component = new SCR_ROUTER_COMPONENT({
    			props: scr_router_component_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(scr_router_component, "routes", scr_router_component_routes_binding));

    	const block = {
    		c: function create() {
    			create_component(scr_router_component.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(scr_router_component, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_router_component_changes = {};

    			if (!updating_routes && dirty & /*routes*/ 1) {
    				updating_routes = true;
    				scr_router_component_changes.routes = /*routes*/ ctx[0];
    				add_flush_callback(() => updating_routes = false);
    			}

    			scr_router_component.$set(scr_router_component_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_router_component.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_component.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scr_router_component, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	SCR_CONFIG_STORE.setNotFoundRoute("/myCustomNotFound");
    	SCR_CONFIG_STORE.setConsoleLogStores(false);
    	SCR_CONFIG_STORE.setNavigationHistoryLimit(10);
    	SCR_CONFIG_STORE.setHashMode(true);
    	SCR_CONFIG_STORE.setUseScroll(true);

    	SCR_CONFIG_STORE.setScrollProps({
    		top: 0,
    		left: 0,
    		behavior: "smooth",
    		timeout: 10
    	});

    	SCR_CONFIG_STORE.setOnError((err, routeObjParams) => {
    		console.log("GLOBAL ERROR CONFIG", routeObjParams);
    	});

    	SCR_CONFIG_STORE.setBeforeEnter([
    		(resolve, routeFrom, routeTo, routeObjParams, payload) => {
    			payload.firstGBEF = "set on Global Enter Function - 1!";
    			console.log(payload);
    			console.log("GBER-1");
    			resolve(true);
    		},
    		(resolve, routeFrom, routeTo, routeObjParams, payload) => {
    			console.log(payload);
    			payload.secondGBEF = "set on Global Enter Function! - 2";
    			console.log("GBER-2");
    			console.log(payload);
    			resolve(true);
    		}
    	]);

    	let routes = [
    		{
    			name: "rootRoute",
    			path: "/svelte-client-router",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_Root$1; }),
    			lazyLoadLayoutComponent: () => Promise.resolve().then(function () { return SCR_Layout$1; }),
    			title: "SCR - Root Route"
    		},
    		{
    			name: "routeOne",
    			path: "/svelte-client-router/test1",
    			component: SCR_C1,
    			ignoreScroll: true,
    			beforeEnter: [
    				resolve => {
    					console.log("beforeEnter Executed");
    					setTimeout(() => resolve(true), 2000);
    				},
    				resolve => {
    					console.log("beforeEnter Executed2");
    					setTimeout(() => resolve({ redirect: "/svelte-client-router" }), 1000);
    				}
    			],
    			title: "First Route Title",
    			loadingProps: { loadingText: "Carregando 1..." }
    		},
    		{
    			name: "routeTwo",
    			path: "/svelte-client-router/test2",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_C2$1; }),
    			title: "Second Route Title",
    			beforeEnter: [
    				(resolve, rFrom, rTo, params, payload) => {
    					console.log(payload);
    					payload.myCustomParam = "123";
    					console.log("<<<<>>>>>");
    					console.log("beforeEnter Executed");
    					console.log(params);
    					setTimeout(() => resolve(true), 1000);
    				}
    			],
    			loadingProps: { loadingText: "Carregando 2..." },
    			scrollProps: {
    				top: 100,
    				left: 100,
    				behavior: "smooth",
    				timeout: 1000
    			}
    		},
    		{
    			name: "routeThree",
    			path: "/svelte-client-router/test3",
    			component: SCR_C4,
    			title: "Third Route Title",
    			beforeEnter: [
    				resolve => {
    					console.log("BEFORE Enter C3");
    					throw new Error("teste");
    				}
    			],
    			onError: (err, params) => {
    				console.log("ERROR DEFINED ROUTER C1", err);
    				console.log(params);
    			}
    		},
    		{
    			name: "routeFour",
    			path: "/svelte-client-router/test4",
    			params: {
    				myCustomParam: "This Param was set in the Router Definition"
    			},
    			title: "Four Route Title",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_C4$1; }),
    			lazyLoadLayoutComponent: () => Promise.resolve().then(function () { return SCR_Layout_Global$1; }),
    			beforeEnter: [
    				(resolve, rFrom, rTo, params, payload) => {
    					console.log(payload);
    					payload.myCustomParam2 = "set on Route Before Enter";
    					resolve(true);
    				}
    			],
    			afterBeforeEnter: routeObjParams => {
    				console.log("After BE Route Four");
    				console.log(routeObjParams);
    			},
    			loadingProps: { loadingText: "Carregando 4..." }
    		},
    		{
    			name: "routeFive",
    			path: "/svelte-client-router/test5",
    			title: "Five Route Title",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_C5$1; }),
    			loadingProps: { loadingText: "Carregando 5..." },
    			ignoreLayout: true,
    			ignoreGlobalBeforeFunction: true
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function scr_router_component_routes_binding(value) {
    		routes = value;
    		$$invalidate(0, routes);
    	}

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_COMPONENT,
    		SCR_CONFIG_STORE,
    		SCR_C1,
    		SCR_C4,
    		SCR_Layout_Global,
    		routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(0, routes = $$props.routes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [routes, scr_router_component_routes_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    /* src/testComponents/SCR_Root.svelte generated by Svelte v3.37.0 */
    const file$3 = "src/testComponents/SCR_Root.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let section0;
    	let h30;
    	let b0;
    	let t1;
    	let br0;
    	let t2;
    	let ul0;
    	let li0;
    	let t4;
    	let li1;
    	let t6;
    	let li2;
    	let t8;
    	let li3;
    	let t10;
    	let button0;
    	let t12;
    	let hr0;
    	let t13;
    	let section1;
    	let h31;
    	let b1;
    	let t15;
    	let br1;
    	let t16;
    	let ul1;
    	let li4;
    	let t18;
    	let li5;
    	let t20;
    	let li6;
    	let t22;
    	let button1;
    	let t24;
    	let hr1;
    	let t25;
    	let section2;
    	let h32;
    	let b2;
    	let t27;
    	let br2;
    	let t28;
    	let ul2;
    	let li7;
    	let t30;
    	let li8;
    	let t32;
    	let li9;
    	let t34;
    	let button2;
    	let t36;
    	let hr2;
    	let t37;
    	let section3;
    	let h33;
    	let b3;
    	let t39;
    	let br3;
    	let t40;
    	let ul3;
    	let li10;
    	let t42;
    	let li11;
    	let t44;
    	let li12;
    	let t46;
    	let li13;
    	let t48;
    	let button3;
    	let t50;
    	let hr3;
    	let t51;
    	let section4;
    	let h34;
    	let b4;
    	let t53;
    	let br4;
    	let t54;
    	let ul4;
    	let li14;
    	let t56;
    	let li15;
    	let t58;
    	let li16;
    	let t60;
    	let li17;
    	let t62;
    	let li18;
    	let t64;
    	let button4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			section0 = element("section");
    			h30 = element("h3");
    			b0 = element("b");
    			b0.textContent = "Route One Executes:";
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Demonstrates Loading Component In Action";
    			t4 = space();
    			li1 = element("li");
    			li1.textContent = "Global Before Enter Functions";
    			t6 = space();
    			li2 = element("li");
    			li2.textContent = "Route Before Enter Functions";
    			t8 = space();
    			li3 = element("li");
    			li3.textContent = "Redirects in the second Before Enter Function to Root Page";
    			t10 = space();
    			button0 = element("button");
    			button0.textContent = "Route One - GO!";
    			t12 = space();
    			hr0 = element("hr");
    			t13 = space();
    			section1 = element("section");
    			h31 = element("h3");
    			b1 = element("b");
    			b1.textContent = "Route Two Executes:";
    			t15 = space();
    			br1 = element("br");
    			t16 = space();
    			ul1 = element("ul");
    			li4 = element("li");
    			li4.textContent = "Global Before Enter Functions";
    			t18 = space();
    			li5 = element("li");
    			li5.textContent = "Route Before Enter Functions";
    			t20 = space();
    			li6 = element("li");
    			li6.textContent = "Resolve Opening the Component";
    			t22 = space();
    			button1 = element("button");
    			button1.textContent = "Route Two - GO!";
    			t24 = space();
    			hr1 = element("hr");
    			t25 = space();
    			section2 = element("section");
    			h32 = element("h3");
    			b2 = element("b");
    			b2.textContent = "Route Three Executes:";
    			t27 = space();
    			br2 = element("br");
    			t28 = space();
    			ul2 = element("ul");
    			li7 = element("li");
    			li7.textContent = "Global Before Enter Functions";
    			t30 = space();
    			li8 = element("li");
    			li8.textContent = "Route Before Enter Functions";
    			t32 = space();
    			li9 = element("li");
    			li9.textContent = "Throws An Error on Before Enter - For Example Purposes!";
    			t34 = space();
    			button2 = element("button");
    			button2.textContent = "Route Three - GO!";
    			t36 = space();
    			hr2 = element("hr");
    			t37 = space();
    			section3 = element("section");
    			h33 = element("h3");
    			b3 = element("b");
    			b3.textContent = "Route Four Executes:";
    			t39 = space();
    			br3 = element("br");
    			t40 = space();
    			ul3 = element("ul");
    			li10 = element("li");
    			li10.textContent = "Global Before Enter Functions";
    			t42 = space();
    			li11 = element("li");
    			li11.textContent = "Route Before Enter Functions";
    			t44 = space();
    			li12 = element("li");
    			li12.textContent = "After Enter Route Function";
    			t46 = space();
    			li13 = element("li");
    			li13.textContent = "Resolve Opening the Component";
    			t48 = space();
    			button3 = element("button");
    			button3.textContent = "Route Four - GO!";
    			t50 = space();
    			hr3 = element("hr");
    			t51 = space();
    			section4 = element("section");
    			h34 = element("h3");
    			b4 = element("b");
    			b4.textContent = "Route Five Executes:";
    			t53 = space();
    			br4 = element("br");
    			t54 = space();
    			ul4 = element("ul");
    			li14 = element("li");
    			li14.textContent = "IGNORES Global Before Enter Functions";
    			t56 = space();
    			li15 = element("li");
    			li15.textContent = "Has NO Before Enter Functions";
    			t58 = space();
    			li16 = element("li");
    			li16.textContent = "IGNORES Layout";
    			t60 = space();
    			li17 = element("li");
    			li17.textContent = "Resolve Opening the Component";
    			t62 = space();
    			li18 = element("li");
    			li18.textContent = "Examples Router Link Component";
    			t64 = space();
    			button4 = element("button");
    			button4.textContent = "Route Five - GO!";
    			attr_dev(b0, "class", "svelte-yb9j7x");
    			add_location(b0, file$3, 7, 6, 149);
    			attr_dev(br0, "class", "svelte-yb9j7x");
    			add_location(br0, file$3, 8, 6, 182);
    			attr_dev(h30, "class", "scr-h3 svelte-yb9j7x");
    			add_location(h30, file$3, 6, 4, 123);
    			attr_dev(li0, "class", "scr-li svelte-yb9j7x");
    			add_location(li0, file$3, 11, 6, 229);
    			attr_dev(li1, "class", "scr-li svelte-yb9j7x");
    			add_location(li1, file$3, 12, 6, 300);
    			attr_dev(li2, "class", "scr-li svelte-yb9j7x");
    			add_location(li2, file$3, 13, 6, 360);
    			attr_dev(li3, "class", "scr-li svelte-yb9j7x");
    			add_location(li3, file$3, 14, 6, 419);
    			attr_dev(ul0, "class", "scr-ul svelte-yb9j7x");
    			add_location(ul0, file$3, 10, 4, 203);
    			attr_dev(button0, "class", "scr-button svelte-yb9j7x");
    			add_location(button0, file$3, 18, 4, 532);
    			attr_dev(section0, "class", "scr-section svelte-yb9j7x");
    			add_location(section0, file$3, 5, 2, 89);
    			attr_dev(hr0, "class", "svelte-yb9j7x");
    			add_location(hr0, file$3, 25, 2, 684);
    			attr_dev(b1, "class", "svelte-yb9j7x");
    			add_location(b1, file$3, 28, 6, 753);
    			attr_dev(br1, "class", "svelte-yb9j7x");
    			add_location(br1, file$3, 29, 6, 786);
    			attr_dev(h31, "class", "scr-h3 svelte-yb9j7x");
    			add_location(h31, file$3, 27, 4, 727);
    			attr_dev(li4, "class", "scr-li svelte-yb9j7x");
    			add_location(li4, file$3, 32, 6, 833);
    			attr_dev(li5, "class", "scr-li svelte-yb9j7x");
    			add_location(li5, file$3, 33, 6, 893);
    			attr_dev(li6, "class", "scr-li svelte-yb9j7x");
    			add_location(li6, file$3, 34, 6, 952);
    			attr_dev(ul1, "class", "scr-ul svelte-yb9j7x");
    			add_location(ul1, file$3, 31, 4, 807);
    			attr_dev(button1, "class", "scr-button svelte-yb9j7x");
    			add_location(button1, file$3, 38, 4, 1036);
    			attr_dev(section1, "class", "scr-section svelte-yb9j7x");
    			add_location(section1, file$3, 26, 2, 693);
    			attr_dev(hr1, "class", "svelte-yb9j7x");
    			add_location(hr1, file$3, 45, 2, 1188);
    			attr_dev(b2, "class", "svelte-yb9j7x");
    			add_location(b2, file$3, 48, 6, 1257);
    			attr_dev(br2, "class", "svelte-yb9j7x");
    			add_location(br2, file$3, 49, 6, 1292);
    			attr_dev(h32, "class", "scr-h3 svelte-yb9j7x");
    			add_location(h32, file$3, 47, 4, 1231);
    			attr_dev(li7, "class", "scr-li svelte-yb9j7x");
    			add_location(li7, file$3, 52, 6, 1339);
    			attr_dev(li8, "class", "scr-li svelte-yb9j7x");
    			add_location(li8, file$3, 53, 6, 1399);
    			attr_dev(li9, "class", "scr-li svelte-yb9j7x");
    			set_style(li9, "color", "red");
    			add_location(li9, file$3, 54, 6, 1458);
    			attr_dev(ul2, "class", "scr-ul svelte-yb9j7x");
    			add_location(ul2, file$3, 51, 4, 1313);
    			attr_dev(button2, "class", "scr-button svelte-yb9j7x");
    			add_location(button2, file$3, 58, 4, 1587);
    			attr_dev(section2, "class", "scr-section svelte-yb9j7x");
    			add_location(section2, file$3, 46, 2, 1197);
    			attr_dev(hr2, "class", "svelte-yb9j7x");
    			add_location(hr2, file$3, 65, 2, 1743);
    			attr_dev(b3, "class", "svelte-yb9j7x");
    			add_location(b3, file$3, 68, 6, 1812);
    			attr_dev(br3, "class", "svelte-yb9j7x");
    			add_location(br3, file$3, 69, 6, 1846);
    			attr_dev(h33, "class", "scr-h3 svelte-yb9j7x");
    			add_location(h33, file$3, 67, 4, 1786);
    			attr_dev(li10, "class", "scr-li svelte-yb9j7x");
    			add_location(li10, file$3, 72, 6, 1893);
    			attr_dev(li11, "class", "scr-li svelte-yb9j7x");
    			add_location(li11, file$3, 73, 6, 1953);
    			attr_dev(li12, "class", "scr-li svelte-yb9j7x");
    			add_location(li12, file$3, 74, 6, 2012);
    			attr_dev(li13, "class", "scr-li svelte-yb9j7x");
    			add_location(li13, file$3, 75, 6, 2069);
    			attr_dev(ul3, "class", "scr-ul svelte-yb9j7x");
    			add_location(ul3, file$3, 71, 4, 1867);
    			attr_dev(button3, "class", "scr-button svelte-yb9j7x");
    			add_location(button3, file$3, 79, 4, 2153);
    			attr_dev(section3, "class", "scr-section svelte-yb9j7x");
    			add_location(section3, file$3, 66, 2, 1752);
    			attr_dev(hr3, "class", "svelte-yb9j7x");
    			add_location(hr3, file$3, 86, 2, 2307);
    			attr_dev(b4, "class", "svelte-yb9j7x");
    			add_location(b4, file$3, 89, 6, 2376);
    			attr_dev(br4, "class", "svelte-yb9j7x");
    			add_location(br4, file$3, 90, 6, 2410);
    			attr_dev(h34, "class", "scr-h3 svelte-yb9j7x");
    			add_location(h34, file$3, 88, 4, 2350);
    			attr_dev(li14, "class", "scr-li svelte-yb9j7x");
    			add_location(li14, file$3, 93, 6, 2457);
    			attr_dev(li15, "class", "scr-li svelte-yb9j7x");
    			add_location(li15, file$3, 94, 6, 2525);
    			attr_dev(li16, "class", "scr-li svelte-yb9j7x");
    			add_location(li16, file$3, 95, 6, 2585);
    			attr_dev(li17, "class", "scr-li svelte-yb9j7x");
    			add_location(li17, file$3, 96, 6, 2630);
    			attr_dev(li18, "class", "scr-li svelte-yb9j7x");
    			add_location(li18, file$3, 99, 6, 2706);
    			attr_dev(ul4, "class", "scr-ul svelte-yb9j7x");
    			add_location(ul4, file$3, 92, 4, 2431);
    			attr_dev(button4, "class", "scr-button svelte-yb9j7x");
    			add_location(button4, file$3, 103, 4, 2791);
    			attr_dev(section4, "class", "scr-section svelte-yb9j7x");
    			add_location(section4, file$3, 87, 2, 2316);
    			attr_dev(main, "class", "scr-main svelte-yb9j7x");
    			add_location(main, file$3, 4, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section0);
    			append_dev(section0, h30);
    			append_dev(h30, b0);
    			append_dev(h30, t1);
    			append_dev(h30, br0);
    			append_dev(section0, t2);
    			append_dev(section0, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t4);
    			append_dev(ul0, li1);
    			append_dev(ul0, t6);
    			append_dev(ul0, li2);
    			append_dev(ul0, t8);
    			append_dev(ul0, li3);
    			append_dev(section0, t10);
    			append_dev(section0, button0);
    			append_dev(main, t12);
    			append_dev(main, hr0);
    			append_dev(main, t13);
    			append_dev(main, section1);
    			append_dev(section1, h31);
    			append_dev(h31, b1);
    			append_dev(h31, t15);
    			append_dev(h31, br1);
    			append_dev(section1, t16);
    			append_dev(section1, ul1);
    			append_dev(ul1, li4);
    			append_dev(ul1, t18);
    			append_dev(ul1, li5);
    			append_dev(ul1, t20);
    			append_dev(ul1, li6);
    			append_dev(section1, t22);
    			append_dev(section1, button1);
    			append_dev(main, t24);
    			append_dev(main, hr1);
    			append_dev(main, t25);
    			append_dev(main, section2);
    			append_dev(section2, h32);
    			append_dev(h32, b2);
    			append_dev(h32, t27);
    			append_dev(h32, br2);
    			append_dev(section2, t28);
    			append_dev(section2, ul2);
    			append_dev(ul2, li7);
    			append_dev(ul2, t30);
    			append_dev(ul2, li8);
    			append_dev(ul2, t32);
    			append_dev(ul2, li9);
    			append_dev(section2, t34);
    			append_dev(section2, button2);
    			append_dev(main, t36);
    			append_dev(main, hr2);
    			append_dev(main, t37);
    			append_dev(main, section3);
    			append_dev(section3, h33);
    			append_dev(h33, b3);
    			append_dev(h33, t39);
    			append_dev(h33, br3);
    			append_dev(section3, t40);
    			append_dev(section3, ul3);
    			append_dev(ul3, li10);
    			append_dev(ul3, t42);
    			append_dev(ul3, li11);
    			append_dev(ul3, t44);
    			append_dev(ul3, li12);
    			append_dev(ul3, t46);
    			append_dev(ul3, li13);
    			append_dev(section3, t48);
    			append_dev(section3, button3);
    			append_dev(main, t50);
    			append_dev(main, hr3);
    			append_dev(main, t51);
    			append_dev(main, section4);
    			append_dev(section4, h34);
    			append_dev(h34, b4);
    			append_dev(h34, t53);
    			append_dev(h34, br4);
    			append_dev(section4, t54);
    			append_dev(section4, ul4);
    			append_dev(ul4, li14);
    			append_dev(ul4, t56);
    			append_dev(ul4, li15);
    			append_dev(ul4, t58);
    			append_dev(ul4, li16);
    			append_dev(ul4, t60);
    			append_dev(ul4, li17);
    			append_dev(ul4, t62);
    			append_dev(ul4, li18);
    			append_dev(section4, t64);
    			append_dev(section4, button4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[0], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[1], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[2], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[3], false, false, false),
    					listen_dev(button4, "click", /*click_handler_4*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Root", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Root> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		pushRoute({ name: "routeOne" });
    	};

    	const click_handler_1 = () => {
    		pushRoute({ name: "routeTwo" });
    	};

    	const click_handler_2 = () => {
    		pushRoute({ name: "routeThree" });
    	};

    	const click_handler_3 = () => {
    		pushRoute({ name: "routeFour" });
    	};

    	const click_handler_4 = () => {
    		pushRoute({ name: "routeFive" });
    	};

    	$$self.$capture_state = () => ({ pushRoute });

    	return [
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class SCR_Root extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Root",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var SCR_Root$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_Root
    });

    /* src/testComponents/SCR_Layout.svelte generated by Svelte v3.37.0 */

    const file$2 = "src/testComponents/SCR_Layout.svelte";
    const get_scr_footer_slot_changes = dirty => ({});
    const get_scr_footer_slot_context = ctx => ({});
    const get_scr_after_main_slot_changes = dirty => ({});
    const get_scr_after_main_slot_context = ctx => ({});
    const get_scr_before_main_slot_changes = dirty => ({});
    const get_scr_before_main_slot_context = ctx => ({});
    const get_scr_header_slot_changes = dirty => ({});
    const get_scr_header_slot_context = ctx => ({});

    // (2:26)      
    function fallback_block_3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Svelte Client Router - The Svelte SPA Router!";
    			attr_dev(h1, "class", "scr-main-layout__header svelte-102jv8t");
    			add_location(h1, file$2, 2, 4, 62);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(2:26)      ",
    		ctx
    	});

    	return block;
    }

    // (7:31)      
    function fallback_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Test some button to see the router working!";
    			attr_dev(p, "class", "scr-main-layout__p svelte-102jv8t");
    			add_location(p, file$2, 7, 4, 207);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(7:31)      ",
    		ctx
    	});

    	return block;
    }

    // (13:30)      
    function fallback_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Nice Routing!";
    			attr_dev(p, "class", "scr-main-layout__p svelte-102jv8t");
    			add_location(p, file$2, 13, 4, 353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(13:30)      ",
    		ctx
    	});

    	return block;
    }

    // (18:26)      
    function fallback_block(ctx) {
    	let footer;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			footer.textContent = "This is some footer content";
    			attr_dev(footer, "class", "scr-main-layout__footer svelte-102jv8t");
    			add_location(footer, file$2, 18, 4, 454);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(18:26)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;
    	const scr_header_slot_template = /*#slots*/ ctx[1].scr_header;
    	const scr_header_slot = create_slot(scr_header_slot_template, ctx, /*$$scope*/ ctx[0], get_scr_header_slot_context);
    	const scr_header_slot_or_fallback = scr_header_slot || fallback_block_3(ctx);
    	const scr_before_main_slot_template = /*#slots*/ ctx[1]["scr_before-main"];
    	const scr_before_main_slot = create_slot(scr_before_main_slot_template, ctx, /*$$scope*/ ctx[0], get_scr_before_main_slot_context);
    	const scr_before_main_slot_or_fallback = scr_before_main_slot || fallback_block_2(ctx);
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);
    	const scr_after_main_slot_template = /*#slots*/ ctx[1]["scr_after-main"];
    	const scr_after_main_slot = create_slot(scr_after_main_slot_template, ctx, /*$$scope*/ ctx[0], get_scr_after_main_slot_context);
    	const scr_after_main_slot_or_fallback = scr_after_main_slot || fallback_block_1(ctx);
    	const scr_footer_slot_template = /*#slots*/ ctx[1].scr_footer;
    	const scr_footer_slot = create_slot(scr_footer_slot_template, ctx, /*$$scope*/ ctx[0], get_scr_footer_slot_context);
    	const scr_footer_slot_or_fallback = scr_footer_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (scr_header_slot_or_fallback) scr_header_slot_or_fallback.c();
    			t0 = space();
    			if (scr_before_main_slot_or_fallback) scr_before_main_slot_or_fallback.c();
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			if (scr_after_main_slot_or_fallback) scr_after_main_slot_or_fallback.c();
    			t3 = space();
    			if (scr_footer_slot_or_fallback) scr_footer_slot_or_fallback.c();
    			attr_dev(main, "class", "scr-main-layout svelte-102jv8t");
    			add_location(main, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (scr_header_slot_or_fallback) {
    				scr_header_slot_or_fallback.m(main, null);
    			}

    			append_dev(main, t0);

    			if (scr_before_main_slot_or_fallback) {
    				scr_before_main_slot_or_fallback.m(main, null);
    			}

    			append_dev(main, t1);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			append_dev(main, t2);

    			if (scr_after_main_slot_or_fallback) {
    				scr_after_main_slot_or_fallback.m(main, null);
    			}

    			append_dev(main, t3);

    			if (scr_footer_slot_or_fallback) {
    				scr_footer_slot_or_fallback.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (scr_header_slot) {
    				if (scr_header_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(scr_header_slot, scr_header_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_scr_header_slot_changes, get_scr_header_slot_context);
    				}
    			}

    			if (scr_before_main_slot) {
    				if (scr_before_main_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(scr_before_main_slot, scr_before_main_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_scr_before_main_slot_changes, get_scr_before_main_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}

    			if (scr_after_main_slot) {
    				if (scr_after_main_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(scr_after_main_slot, scr_after_main_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_scr_after_main_slot_changes, get_scr_after_main_slot_context);
    				}
    			}

    			if (scr_footer_slot) {
    				if (scr_footer_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(scr_footer_slot, scr_footer_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_scr_footer_slot_changes, get_scr_footer_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_header_slot_or_fallback, local);
    			transition_in(scr_before_main_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			transition_in(scr_after_main_slot_or_fallback, local);
    			transition_in(scr_footer_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_header_slot_or_fallback, local);
    			transition_out(scr_before_main_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			transition_out(scr_after_main_slot_or_fallback, local);
    			transition_out(scr_footer_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (scr_header_slot_or_fallback) scr_header_slot_or_fallback.d(detaching);
    			if (scr_before_main_slot_or_fallback) scr_before_main_slot_or_fallback.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (scr_after_main_slot_or_fallback) scr_after_main_slot_or_fallback.d(detaching);
    			if (scr_footer_slot_or_fallback) scr_footer_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Layout", slots, ['scr_header','scr_before-main','default','scr_after-main','scr_footer']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class SCR_Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Layout",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    var SCR_Layout$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_Layout
    });

    /* src/testComponents/SCR_C2.svelte generated by Svelte v3.37.0 */
    const file$1 = "src/testComponents/SCR_C2.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let div0;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let button;
    	let t6;
    	let div1;
    	let t8;
    	let div2;
    	let t10;
    	let div3;
    	let t12;
    	let div4;
    	let t14;
    	let div5;
    	let t16;
    	let div6;
    	let t18;
    	let div7;
    	let t20;
    	let div8;
    	let t22;
    	let div9;
    	let t24;
    	let div10;
    	let t26;
    	let div11;
    	let t28;
    	let div12;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Component Two!";
    			t1 = space();
    			div0 = element("div");
    			t2 = text("A\n    ");
    			br0 = element("br");
    			t3 = space();
    			br1 = element("br");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Go Back";
    			t6 = space();
    			div1 = element("div");
    			div1.textContent = "B";
    			t8 = space();
    			div2 = element("div");
    			div2.textContent = "C";
    			t10 = space();
    			div3 = element("div");
    			div3.textContent = "D";
    			t12 = space();
    			div4 = element("div");
    			div4.textContent = "E";
    			t14 = space();
    			div5 = element("div");
    			div5.textContent = "F";
    			t16 = space();
    			div6 = element("div");
    			div6.textContent = "G";
    			t18 = space();
    			div7 = element("div");
    			div7.textContent = "H";
    			t20 = space();
    			div8 = element("div");
    			div8.textContent = "I";
    			t22 = space();
    			div9 = element("div");
    			div9.textContent = "J";
    			t24 = space();
    			div10 = element("div");
    			div10.textContent = "K";
    			t26 = space();
    			div11 = element("div");
    			div11.textContent = "L";
    			t28 = space();
    			div12 = element("div");
    			div12.textContent = "M";
    			add_location(h2, file$1, 5, 2, 72);
    			add_location(br0, file$1, 8, 4, 114);
    			add_location(br1, file$1, 9, 4, 125);
    			attr_dev(button, "class", "scr-button svelte-um95cl");
    			add_location(button, file$1, 10, 4, 136);
    			attr_dev(div0, "class", "svelte-um95cl");
    			add_location(div0, file$1, 6, 2, 98);
    			attr_dev(div1, "class", "svelte-um95cl");
    			add_location(div1, file$1, 17, 2, 256);
    			attr_dev(div2, "class", "svelte-um95cl");
    			add_location(div2, file$1, 18, 2, 271);
    			attr_dev(div3, "class", "svelte-um95cl");
    			add_location(div3, file$1, 19, 2, 286);
    			attr_dev(div4, "class", "svelte-um95cl");
    			add_location(div4, file$1, 20, 2, 301);
    			attr_dev(div5, "class", "svelte-um95cl");
    			add_location(div5, file$1, 21, 2, 316);
    			attr_dev(div6, "class", "svelte-um95cl");
    			add_location(div6, file$1, 22, 2, 331);
    			attr_dev(div7, "class", "svelte-um95cl");
    			add_location(div7, file$1, 23, 2, 346);
    			attr_dev(div8, "class", "svelte-um95cl");
    			add_location(div8, file$1, 24, 2, 361);
    			attr_dev(div9, "class", "J_TEST svelte-um95cl");
    			add_location(div9, file$1, 25, 2, 376);
    			attr_dev(div10, "class", "svelte-um95cl");
    			add_location(div10, file$1, 26, 2, 406);
    			attr_dev(div11, "class", "svelte-um95cl");
    			add_location(div11, file$1, 27, 2, 421);
    			attr_dev(div12, "class", "svelte-um95cl");
    			add_location(div12, file$1, 28, 2, 436);
    			attr_dev(main, "class", "svelte-um95cl");
    			add_location(main, file$1, 4, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			append_dev(div0, t2);
    			append_dev(div0, br0);
    			append_dev(div0, t3);
    			append_dev(div0, br1);
    			append_dev(div0, t4);
    			append_dev(div0, button);
    			append_dev(main, t6);
    			append_dev(main, div1);
    			append_dev(main, t8);
    			append_dev(main, div2);
    			append_dev(main, t10);
    			append_dev(main, div3);
    			append_dev(main, t12);
    			append_dev(main, div4);
    			append_dev(main, t14);
    			append_dev(main, div5);
    			append_dev(main, t16);
    			append_dev(main, div6);
    			append_dev(main, t18);
    			append_dev(main, div7);
    			append_dev(main, t20);
    			append_dev(main, div8);
    			append_dev(main, t22);
    			append_dev(main, div9);
    			append_dev(main, t24);
    			append_dev(main, div10);
    			append_dev(main, t26);
    			append_dev(main, div11);
    			append_dev(main, t28);
    			append_dev(main, div12);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_C2", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_C2> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		backRoute();
    	};

    	$$self.$capture_state = () => ({ backRoute });
    	return [click_handler];
    }

    class SCR_C2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_C2",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var SCR_C2$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_C2
    });

    /* src/testComponents/SCR_C5.svelte generated by Svelte v3.37.0 */
    const file = "src/testComponents/SCR_C5.svelte";

    // (13:2) <SCR_ROUTER_LINK     to={{ name: "rootRoute" }}     props={{ pushCustomParam: "Custom Param Defined Router Link - Navigation" }}     elementProps={{       style: `margin: 1rem; padding: 1rem 0; display: grid; grid-template-columns: 1fr; justify-content: center; align-content:center; background-color:#ff3e0012`,     }}   >
    function create_default_slot(ctx) {
    	let button;
    	let t0;
    	let br;
    	let t1;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text("Button With No Click Action");
    			br = element("br");
    			t1 = text("But Works Because Router Link!");
    			add_location(br, file, 19, 58, 599);
    			attr_dev(button, "class", "scr-button svelte-10f8n0o");
    			add_location(button, file, 19, 4, 545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, br);
    			append_dev(button, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(13:2) <SCR_ROUTER_LINK     to={{ name: \\\"rootRoute\\\" }}     props={{ pushCustomParam: \\\"Custom Param Defined Router Link - Navigation\\\" }}     elementProps={{       style: `margin: 1rem; padding: 1rem 0; display: grid; grid-template-columns: 1fr; justify-content: center; align-content:center; background-color:#ff3e0012`,     }}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h2;
    	let t1;
    	let button;
    	let t3;
    	let scr_router_link;
    	let current;
    	let mounted;
    	let dispose;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "rootRoute" },
    				props: {
    					pushCustomParam: "Custom Param Defined Router Link - Navigation"
    				},
    				elementProps: {
    					style: `margin: 1rem; padding: 1rem 0; display: grid; grid-template-columns: 1fr; justify-content: center; align-content:center; background-color:#ff3e0012`
    				},
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h2 = element("h2");
    			h2.textContent = "Component Five!";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Go Back";
    			t3 = space();
    			create_component(scr_router_link.$$.fragment);
    			add_location(h2, file, 5, 2, 89);
    			attr_dev(button, "class", "scr-button svelte-10f8n0o");
    			add_location(button, file, 6, 2, 116);
    			attr_dev(main, "class", "svelte-10f8n0o");
    			add_location(main, file, 4, 0, 80);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h2);
    			append_dev(main, t1);
    			append_dev(main, button);
    			append_dev(main, t3);
    			mount_component(scr_router_link, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_router_link_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				scr_router_link_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link.$set(scr_router_link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_router_link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(scr_router_link);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_C5", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_C5> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		backRoute();
    	};

    	$$self.$capture_state = () => ({ SCR_ROUTER_LINK, backRoute });
    	return [click_handler];
    }

    class SCR_C5 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_C5",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var SCR_C5$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_C5
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
