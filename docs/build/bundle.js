
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
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

    function setConsiderTrailingSlashOnMatchingRoute(
      considerTrailingSlashOnMachingRoute
    ) {
      if (typeof considerTrailingSlashOnMachingRoute == "boolean") {
        updateStoreKey(store$2, { considerTrailingSlashOnMachingRoute });
      }
    }

    function getConsiderTrailingSlashOnMatchingRoute() {
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
      setConsiderTrailingSlashOnMatchingRoute,
      getConsiderTrailingSlashOnMatchingRoute,
      setScrollProps,
      getScrollProps,
      setUseScroll,
      getUseScroll,
      setOnError,
      getOnError,
      setBeforeEnter,
      getBeforeEnter,
    };

    //import { isBefore, addMilliseconds } from "date-fns";

    const LS = localStorage;
    const PREFIX_KEY$1 = "SCR_ROUTER_";
    const EXPIRE_KEYS$1 = `${PREFIX_KEY$1}EXPIRE_KEYS`;

    const getItem$1 = (key) => {
      // removeExpiredKeys();
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
      // removeExpiredKeys();
      // if (
      //   time &&
      //   Number.isSafeInteger(time) &&
      //   Number.isInteger(time) &&
      //   time > 0
      // ) {
      //   addExpireKey(key, time);
      // }
      LS.setItem(key, toJSON$1(value));
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
    // export const removeExpiredKeys = () => {
    //   let keyList = [];
    //   let expire = fromJSON(LS.getItem(EXPIRE_KEYS));

    //   if (expire && expire.length > 0) {
    //     expire = expire.filter((item) => {
    //       if (
    //         isBefore(new Date(), new Date(item.liveUntil)) &&
    //         LS.getItem(item.key)
    //       ) {
    //         return true;
    //       }
    //       LS.removeItem(item.key);
    //       keyList.push(item.key);
    //     });

    //     if (expire.length > 0) {
    //       LS.setItem(EXPIRE_KEYS, toJSON(expire));
    //     } else {
    //       LS.removeItem(EXPIRE_KEYS);
    //     }
    //   }
    //   return keyList;
    // };

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
        setItem$1(key, store);
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
    // function addExpireKey(key, time) {
    //   if (!Number.isInteger(time) || !Number.isSafeInteger(time)) {
    //     throw new Error("Time to add an expire key is not a safe integer");
    //   }

    //   let expire = fromJSON(LS.getItem(EXPIRE_KEYS));
    //   const liveUntil = addMilliseconds(new Date(), time);

    //   if (expire !== null && expire !== undefined) {
    //     expire = expire.filter((item) => item.key !== key);
    //     expire.push({ key, liveUntil });
    //   } else {
    //     expire = [{ key, liveUntil }];
    //   }

    //   LS.setItem(EXPIRE_KEYS, toJSON(expire));
    // }

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
        // await removeExpiredKeys();
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
        // await removeExpiredKeys();
        if (
          time &&
          Number.isSafeInteger(time) &&
          Number.isInteger(time) &&
          time > 0
        ) {
          // await addExpireKey(key, time);
        }
        await LF.setItem(key, toJSON(value));
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
    // export const removeExpiredKeys = async () => {
    //   try {
    //     let keyList = [];
    //     let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));

    //     if (expire && expire.length > 0) {
    //       expire = await expire.filter(async (item) => {
    //         if (
    //           isBefore(new Date(), new Date(item.liveUntil)) &&
    //           (await LF.getItem(item.key))
    //         ) {
    //           return true;
    //         }
    //         await LF.removeItem(item.key);
    //         keyList.push(item.key);
    //       });

    //       if (expire.length > 0) {
    //         await LF.setItem(EXPIRE_KEYS, toJSON(expire));
    //       } else {
    //         await LF.removeItem(EXPIRE_KEYS);
    //       }
    //     }
    //     return keyList;
    //   } catch (error) {
    //     throw error;
    //   }
    // };

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
    // async function addExpireKey(key, time) {
    //   try {
    //     if (!Number.isInteger(time) || !Number.isSafeInteger(time)) {
    //       throw new Error("Time to add an expire key is not a safe integer");
    //     }

    //     let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));
    //     const liveUntil = addMilliseconds(new Date(), time);

    //     if (expire !== null && expire !== undefined) {
    //       expire = expire.filter((item) => item.key !== key);
    //       expire.push({ key, liveUntil });
    //     } else {
    //       expire = [{ key, liveUntil }];
    //     }

    //     await LF.setItem(EXPIRE_KEYS, toJSON(expire));
    //   } catch (error) {
    //     throw error;
    //   }
    // }

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

    const PATH_PARAM_CHAR = "/:";

    // -----------------  function hasPathParam  -----------------------------------------

    function hasPathParam(path) {
      return path && path.includes(PATH_PARAM_CHAR);
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function loadFromStorage  --------------------------------------

    async function loadFromStorage() {
      // is to load from storages?
      const saveMode = configStore.getSaveMode();
      if (saveMode === "localstorage") {
        await getSvelteStoreInStorage$1(
          routerStore.update,
          routerStore.STORAGE_KEY
        );
      } else if (saveMode === "indexeddb") {
        await getSvelteStoreInStorage(
          routerStore.update,
          routerStore.STORAGE_KEY
        );
      }
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function getBeforeEnterAsArray  --------------------------------

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
    // -----------------  function getFindRouteFunc  -------------------------------------

    function getFindRouteFunc(path, realParamPath = { path: false }) {
      // adding trailing slash to route or not
      const hasTrailingSlash = getTrailingSlash();

      let realPath = path.toString();
      if (configStore.getHashMode()) {
        realPath = realPath.split("?");
        realPath = realPath[0];
      }
      if (realPath.substring(realPath.length - 1) != "/") {
        realPath += "/";
      }

      return (routeItem) => {
        // get route path to search with trailing slash if included
        const routePath = routeItem.path + hasTrailingSlash;

        // if route has regex declared
        if (hasPathParam(routeItem.path)) {

          // splitting to compare path sections
          const routeDefArr = routePath.split("/");
          const pathDefArr = realPath.split("/");
          if (routeDefArr.length != pathDefArr.length) {
            return false;
          }

          for (let key in routeDefArr) {
            // if the section is different and it is not regex then it is not it
            if (
              routeDefArr[key] != pathDefArr[key] &&
              !routeDefArr[key].includes(":")
            ) {
              return false;
            }
          }
          
          // realParamPath when using navigation if not using path
          realParamPath.path = realPath;

          // if check all sections and not returned then we have our matching route
          return routeItem;

          // route with no regex declared
        } else if (
          routeItem.path == realPath ||
          (configStore.getConsiderTrailingSlashOnMatchingRoute() &&
            routePath == realPath)
        ) {
          return routeItem;
        }
        return false;
      };
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function getLocation  ------------------------------------------

    function getLocation(routeObj) {
      let pathname = location.pathname;
      let objHash;
      let params;

      if (routeObj) {
        // realParamPath when using navigation if not using path
        pathname = routeObj.realParamPath || routeObj.path;
        objHash = "#" + routeObj.path;
        params = routeObj.params;
      } else if (configStore.getHashMode() && location.hash) {
        pathname = location.hash.slice(1);
      }

      let currentLocation = {
        pathname,
        params: params || getUrlParameter(location.href),
        hostname: location.hostname,
        protocol: location.protocol,
        port: location.port,
        origin: location.origin,
        hash: objHash || location.hash,
      };

      return currentLocation;
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function getPathParams  ----------------------------------------

    function getPathParams(path, routePath) {
      if (!hasPathParam(routePath)) {
        return {};
      }

      let pathParams = {};
      const hasTrailingSlash = getTrailingSlash();

      routePath += hasTrailingSlash;
      const routeDefArr = routePath.split("/");
      const pathDefArr = path.split("/");

      for (let key in routeDefArr) {
        if (routeDefArr[key].includes(":")) {
          pathParams = {
            ...pathParams,
            [routeDefArr[key].replace(":", "")]: pathDefArr[key],
          };
        }
      }

      return pathParams;
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function getQueryParams  ---------------------------------------

    function getQueryParams(currentLocation) {
      if (!currentLocation || typeof currentLocation != "object") {
        return {};
      }
      let queryParams = currentLocation.params;
      if (configStore.getHashMode()) {
        let queryArr = currentLocation.pathname.split("?");
        if (!queryArr || !queryArr[1]) {
          return {};
        }
        queryArr = queryArr[1].split("&");
        queryParams = {};
        let splitItem;
        for(let item of queryArr) {
          splitItem = item.split("=");
          if (splitItem && splitItem[0] && splitItem[1]) {
            queryParams = {
              ...queryParams,
              [splitItem[0]]: splitItem[1]
            };
          }
        }
      }

      return queryParams;
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function getQueryParamsToPath  ---------------------------------

    function getQueryParamsToPath(currentLocation) {
      if (!currentLocation || typeof currentLocation != "object" || currentLocation.pathname.includes("?")) {
        return "";
      }
      let queryToPath = "?";
      if (configStore.getHashMode()) {
        let queryArr = currentLocation.pathname.split("?");
        if (queryArr && queryArr[1]) {
          return "?" + queryArr[1];
        }
        return "";
      }
      for (let key in currentLocation.params) {
        queryToPath += `${key}=${currentLocation.params[key]}&`;
      }
      return queryToPath.slice(0, -1);
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function getTrailingSlash  -------------------------------------

    function getTrailingSlash() {
      return configStore.getConsiderTrailingSlashOnMatchingRoute() ? "/" : "";
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

    // -----------------------------------------------------------------------------------
    // -----------------  function replacePathParamWithParams  ---------------------------

    function replacePathParamWithParams(path, routePath) {
      if (!hasPathParam(routePath)) {
        return routePath;
      }
      routePath += getTrailingSlash();
      const routeDefArr = routePath.split("/");
      const pathDefArr = path.split("/");
      for (let key in routeDefArr) {
        if (routeDefArr[key].includes(":")) {
          routePath = routePath.replace(routeDefArr[key], pathDefArr[key]);
        }
      }
      return routePath;
    }

    // -----------------------------------------------------------------------------------

    const storeTemplate = {
      pushRoute: false,
      params: {},
    };

    const store = writable(assign({}, storeTemplate));
    let routeNavigation;

    // --------------  pushRoute Property  --------------------------------------------------

    function pushRoute$1(route, params = {}, onError) {
      if (!route) {
        const error = new Error(`SCR_ROUTER - Route not defined - ${route}`);
        if (typeof onError === "function") {
          onError(error);
        } else {
          throw error;
        }
      }
      const routes = routerStore.getRoutes();
      
      let realParamPath = { path: false };
      routeNavigation = undefined;
      if (typeof route === "string") {
        routeNavigation = routes.find(getFindRouteFunc(route, realParamPath));
      } else if (route.path) {
        routeNavigation = routes.find(getFindRouteFunc(route.path, realParamPath));
      } else if (route.name) {
        routeNavigation = routes.find((rItem) => rItem.name === route.name);
      }

      if (!routeNavigation) {
        routeNavigation = {
          notFound: true,
          path: typeof route === "string" ? route : route.path || "",
        };
      } 
      if (realParamPath.path) {
        routeNavigation.realParamPath = realParamPath.path;
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

    function backRoute() {
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
      backRoute,
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
    const file$t = "src/components/SCR_NotFound.svelte";

    function create_fragment$v(ctx) {
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
    			add_location(p0, file$t, 5, 2, 82);
    			attr_dev(p1, "class", "scr-p-small svelte-zj7cmj");
    			add_location(p1, file$t, 6, 2, 115);
    			add_location(center, file$t, 4, 0, 71);
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
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
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

    class SCR_NotFound$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_NotFound",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src/components/SCR_Loading.svelte generated by Svelte v3.37.0 */

    const file$s = "src/components/SCR_Loading.svelte";

    function create_fragment$u(ctx) {
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
    			add_location(div0, file$s, 6, 4, 125);
    			attr_dev(div1, "class", "svelte-146mxqr");
    			add_location(div1, file$s, 7, 4, 137);
    			attr_dev(div2, "class", "svelte-146mxqr");
    			add_location(div2, file$s, 8, 4, 149);
    			attr_dev(div3, "class", "svelte-146mxqr");
    			add_location(div3, file$s, 9, 4, 161);
    			attr_dev(div4, "class", "svelte-146mxqr");
    			add_location(div4, file$s, 10, 4, 173);
    			attr_dev(div5, "class", "svelte-146mxqr");
    			add_location(div5, file$s, 11, 4, 185);
    			attr_dev(div6, "class", "svelte-146mxqr");
    			add_location(div6, file$s, 12, 4, 197);
    			attr_dev(div7, "class", "svelte-146mxqr");
    			add_location(div7, file$s, 13, 4, 209);
    			attr_dev(div8, "class", "svelte-146mxqr");
    			add_location(div8, file$s, 14, 4, 221);
    			attr_dev(div9, "class", "svelte-146mxqr");
    			add_location(div9, file$s, 15, 4, 233);
    			attr_dev(div10, "class", "svelte-146mxqr");
    			add_location(div10, file$s, 16, 4, 245);
    			attr_dev(div11, "class", "svelte-146mxqr");
    			add_location(div11, file$s, 17, 4, 257);
    			attr_dev(div12, "class", "scr-lds-spinner svelte-146mxqr");
    			add_location(div12, file$s, 5, 2, 91);
    			attr_dev(h1, "class", "scr-h1 svelte-146mxqr");
    			add_location(h1, file$s, 19, 2, 276);
    			attr_dev(center, "class", "scr-center svelte-146mxqr");
    			add_location(center, file$s, 4, 0, 61);
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Loading", slots, []);
    	let { loadingText = "Loading..." } = $$props;
    	const writable_props = ["loadingText"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("loadingText" in $$props) $$invalidate(0, loadingText = $$props.loadingText);
    	};

    	$$self.$capture_state = () => ({ loadingText });

    	$$self.$inject_state = $$props => {
    		if ("loadingText" in $$props) $$invalidate(0, loadingText = $$props.loadingText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loadingText];
    }

    class SCR_Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { loadingText: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Loading",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get loadingText() {
    		throw new Error("<SCR_Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadingText(value) {
    		throw new Error("<SCR_Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/SCR_Error.svelte generated by Svelte v3.37.0 */

    const file$r = "src/components/SCR_Error.svelte";

    function create_fragment$t(ctx) {
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
    			add_location(p0, file$r, 5, 2, 84);
    			attr_dev(p1, "class", "scr-p-small svelte-jhjhwz");
    			add_location(p1, file$r, 6, 2, 113);
    			add_location(center, file$r, 4, 0, 73);
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
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
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

    class SCR_Error$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, { errorMessage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Error",
    			options,
    			id: create_fragment$t.name
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

    const file$q = "src/components/SCR_Layout.svelte";
    const get_scr_header_slot_changes$1 = dirty => ({});
    const get_scr_header_slot_context$1 = ctx => ({});

    // (2:26)      
    function fallback_block$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Svelte Client Router - The Svelte SPA Router!";
    			attr_dev(h1, "class", "scr-main-layout__header svelte-1brx1pu");
    			add_location(h1, file$q, 2, 4, 62);
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
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(2:26)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
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
    			attr_dev(main, "class", "scr-main-layout svelte-1brx1pu");
    			add_location(main, file$q, 0, 0, 0);
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
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
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

    class SCR_Layout$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Layout",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src/components/SCR_Router.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1, console: console_1$1 } = globals;

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

    // (517:0) {:then value}
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
    		source: "(517:0) {:then value}",
    		ctx
    	});

    	return block;
    }

    // (522:2) {:else}
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
    		source: "(522:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (518:2) {#if $configStore.usesRouteLayout && typeof layoutComponent === "function"}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*layoutComponent*/ ctx[6];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$k] },
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
    		source: "(518:2) {#if $configStore.usesRouteLayout && typeof layoutComponent === \\\"function\\\"}",
    		ctx
    	});

    	return block;
    }

    // (519:4) <svelte:component this={layoutComponent} {...props}>
    function create_default_slot$k(ctx) {
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
    		id: create_default_slot$k.name,
    		type: "slot",
    		source: "(519:4) <svelte:component this={layoutComponent} {...props}>",
    		ctx
    	});

    	return block;
    }

    // (515:23)    <svelte:component this={loadingComponent}
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
    		source: "(515:23)    <svelte:component this={loadingComponent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
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
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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
    	let { notFoundComponent = SCR_NotFound$1 } = $$props;
    	let { errorComponent = SCR_Error$1 } = $$props;
    	let { defaultLayoutComponent = SCR_Layout$1 } = $$props;
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
    	let isBacking = false;

    	// -----------------------------------------------------------------------------------
    	// -----------------  function pushRoute  --------------------------------------------
    	function pushRoute(routePath, popEvent = true) {
    		routePath = ($configStore.hashMode ? "#" : "") + routePath;

    		if (history.pushState && !isBacking) {
    			history.pushState(null, null, routePath);
    		} else {
    			location.hash = routePath + getQueryParamsToPath(currentLocation);
    		}

    		isBacking = false;

    		if (popEvent) {
    			window.dispatchEvent(new Event("popstate"));
    		}
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function getRouteParams  ---------------------------------------
    	function getRouteParams(routeObj, customParams) {
    		$$invalidate(2, props = {});

    		if (routeObj) {
    			$$invalidate(2, props = {
    				payload: routeObj.payload,
    				...routeObj.params || {},
    				...assign({}, allProps),
    				pathParams: {
    					...getPathParams(currentLocation.pathname, routeObj.path)
    				},
    				queryParams: { ...getQueryParams(currentLocation) }
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
    	// -----------------  function throwRouteError  --------------------------------------
    	function throwRouteError(routeObj, error) {
    		if (routeObj.onError && typeof routeObj.onError === "function") {
    			routeObj.onError(error, getRouteParams(routeObj));
    			return setErrorComponent(`SCR_ROUTER - Caught an error: ${error}!`, error, routeObj);
    		}

    		throw `Error on route (${routeObj.name} - ${routeObj.path}) - ${error}!`;
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function loadRoute  --------------------------------------------
    	async function loadRoute(routeObj, isLoading = true) {
    		try {
    			// if it is to reload current route if is redirected to the same route
    			if (routeObj && !routeObj.forceReload && currentLocation.pathname === routeObj.path) {
    				return;
    			}

    			// updating location
    			currentLocation = getLocation(routeObj);

    			// cleaning component for later check if the route has a custom one
    			$$invalidate(6, layoutComponent = false);

    			if (currentLocation.pathname === $configStore.errorRoute) {
    				$$invalidate(4, currentComponent = errorComponent);
    				return;
    			}

    			// searching route from routes definition if not defined
    			if (!routeObj) {
    				routeObj = $routerStore.routes.find(getFindRouteFunc(currentLocation.pathname));
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

    			getRouteParams(routeObj);

    			// setting loading property and start loading screen
    			$$invalidate(5, loadingPromise = loadingController$1.startLoading());

    			$$invalidate(3, loadingProps = { ...assign({}, allLoadingProps) });

    			// adding route params to loading props
    			if (routeObj.loadingProps) {
    				$$invalidate(3, loadingProps = {
    					...loadingProps,
    					...routeObj.loadingProps,
    					...props
    				});
    			}

    			//
    			await routerStore.setCurrentLocation(currentLocation.pathname);

    			const configBERs = configStore.getBeforeEnter();

    			// checking if the this route has beforeEnter functions to execute
    			if (!routeObj.beforeEnter && (!configBERs || routeObj.ignoreGlobalBeforeFunction)) {
    				return await finalizeRoute(routeObj, isLoading);
    			}

    			// getting all before enter function of the route
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
    			console.log(error);
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

    		routeObj.payload = {};
    		getRouteParams(routeObj);

    		for (let bFunc of beforeEnterArr) {
    			// beforeEnter Function is not a function throw an error
    			if (!bFunc || typeof bFunc !== "function") {
    				throw new Error(`SCR_ROUTER - Before Enter Function of route (${routeObj.name} - ${routeObj.path}) is not a function!`);
    			}

    			// promisify each beforeEnter
    			resFunc = await new Promise(async (resolve, reject) => {
    					try {
    						// executing beforeEnter Functions GLOBAL And Route Specific
    						await bFunc(resolve, routeFrom, routeTo, props, routeObj.payload);

    						// reseting payload if destroyed
    						if (!routeObj.payload) {
    							routeObj.payload = {};

    							if ($configStore.consoleLogErrorMessages) {
    								console.warn("SCR_ROUTER - Payload property were redefined");
    							}
    						}

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
    				return throwRouteError(routeObj, resFunc.error);
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
    					return throwRouteError(routeObj, notFoundRouteName);
    				}

    				return pushRoute(findRoute.path);
    			}

    			return throwRouteError(routeObj, new Error("The resolve option was not able to understand the parameters passed!"));
    		}

    		// finalizeRoute definitions
    		return await finalizeRoute(routeObj, isLoading);
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function finalizeRoute  ----------------------------------------
    	async function finalizeRoute(routeObj, isLoading = false) {
    		// setting route title if defined
    		if (routeObj.title) {
    			document.title = routeObj.title;
    		}

    		// updating route store info
    		await routerStore.setFromRoute($routerStore.currentRoute);

    		await routerStore.pushNavigationHistory($routerStore.currentRoute);
    		const routePathWithParams = replacePathParamWithParams(currentLocation.pathname, routeObj.path);

    		// is loading means that we don't know yet the route name and we should add it
    		// to the object - when we are pushing routes for example we know which route we
    		// are pushing, but when the user enters via URL then we should figure it out.
    		if (!isLoading) {
    			// we have to add the route name
    			await routerStore.setCurrentRoute({
    				pathname: routePathWithParams + getQueryParamsToPath(currentLocation),
    				params: { ...routeObj.params },
    				hostname: currentLocation.hostname,
    				protocol: currentLocation.protocol,
    				port: currentLocation.port,
    				origin: currentLocation.origin,
    				hash: currentLocation.hash,
    				name: routeObj.name
    			});
    		} else {
    			await routerStore.setCurrentRoute({
    				...currentLocation,
    				name: routeObj.name,
    				pathname: currentLocation.pathname + getQueryParamsToPath(currentLocation)
    			});
    		}

    		// if user defined some action before finalizeRoute
    		if (routeObj.afterBeforeEnter && typeof routeObj.afterBeforeEnter === "function") {
    			routeObj.afterBeforeEnter(props);
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

    		// no component were defined by the user
    		if (!routeObj.component && !routeObj.lazyLoadComponent) {
    			throw new Error(`No component defined for ${routeObj.name || "Route"} - ${routeObj.path || "Path"}!`);
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

    		return pushRoute($routerStore.currentRoute.pathname, false);
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function onMount  ----------------------------------------------
    	onMount(async () => {
    		// is to load from storages?
    		await loadFromStorage();

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
    		isBacking = false;

    		await loadRoute();
    	});

    	// -----------------------------------------------------------------------------------
    	// -----------------  Window - eventListener popstate  -------------------------------
    	window.addEventListener("popstate", async event => {
    		isBacking = true;
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<SCR_Router> was created with unknown prop '${key}'`);
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
    		loadFromStorage,
    		getBeforeEnterAsArray,
    		getFindRouteFunc,
    		getLocation,
    		getPathParams,
    		getQueryParams,
    		getQueryParamsToPath,
    		replacePathParamWithParams,
    		configStore,
    		routerStore,
    		navigateStore,
    		LoadingController: loadingController,
    		SCR_NotFound: SCR_NotFound$1,
    		SCR_Loading,
    		SCR_Error: SCR_Error$1,
    		SCR_Layout: SCR_Layout$1,
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
    		isBacking,
    		pushRoute,
    		getRouteParams,
    		setErrorComponent,
    		throwRouteError,
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
    		if ("isBacking" in $$props) isBacking = $$props.isBacking;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$configStore, $routerStore*/ 8194) {
    			// -----------------------------------------------------------------------------------
    			// -----------------  svelte_reactive - $configStore.consoleLogStores  ---------------
    			if ($configStore.consoleLogStores && $routerStore) {
    				console.log(" ----- SCR - Router Store ------------ ");
    				console.log($routerStore);
    				console.log(" ------------------------------------- ");
    			}
    		}

    		if ($$self.$$.dirty & /*$configStore*/ 2) {
    			if ($configStore.consoleLogStores && $configStore) {
    				console.log(" ----- SCR - Configuration Store ----- ");
    				console.log($configStore);
    				console.log(" ------------------------------------- ");
    			}
    		}

    		if ($$self.$$.dirty & /*$configStore, $navigateStore*/ 16386) {
    			if ($configStore.consoleLogStores && $navigateStore) {
    				console.log(" ----- SCR - Navigate Store ---------- ");
    				console.log($navigateStore);
    				console.log(" ------------------------------------- ");
    			}
    		}

    		if ($$self.$$.dirty & /*$navigateStore*/ 16384) {
    			// -----------------------------------------------------------------------------------
    			// -----------------  svelte_reactive - $navigateStore.pushRoute  --------------------
    			if ($navigateStore.pushRoute) {
    				isBacking = false;
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

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
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
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*routes*/ ctx[7] === undefined && !("routes" in props)) {
    			console_1$1.warn("<SCR_Router> was created without expected prop 'routes'");
    		}
    	}

    	get routes() {
    		throw new Error_1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get notFoundComponent() {
    		throw new Error_1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set notFoundComponent(value) {
    		throw new Error_1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errorComponent() {
    		throw new Error_1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorComponent(value) {
    		throw new Error_1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultLayoutComponent() {
    		throw new Error_1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultLayoutComponent(value) {
    		throw new Error_1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadingComponent() {
    		throw new Error_1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadingComponent(value) {
    		throw new Error_1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allProps() {
    		throw new Error_1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allProps(value) {
    		throw new Error_1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allLoadingProps() {
    		throw new Error_1("<SCR_Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allLoadingProps(value) {
    		throw new Error_1("<SCR_Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/SCR_RouterLink.svelte generated by Svelte v3.37.0 */
    const file$p = "src/components/SCR_RouterLink.svelte";

    function create_fragment$q(ctx) {
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
    			add_location(div, file$p, 17, 0, 393);
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
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_RouterLink", slots, ['default']);
    	let { props = undefined } = $$props;
    	let { onError = undefined } = $$props;
    	let { to = undefined } = $$props;
    	let { elementProps = undefined } = $$props;

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

    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {
    			props: 2,
    			onError: 3,
    			to: 4,
    			elementProps: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouterLink",
    			options,
    			id: create_fragment$q.name
    		});
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

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/docs/SCR_Menu.svelte generated by Svelte v3.37.0 */
    const file$o = "src/docs/SCR_Menu.svelte";

    // (7:2) <SCR_ROUTER_LINK to={{ name: "rootRoute" }}>
    function create_default_slot_16(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Presentation";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 7, 4, 187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(7:2) <SCR_ROUTER_LINK to={{ name: \\\"rootRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (10:2) <SCR_ROUTER_LINK to={{ name: "installationRoute" }}>
    function create_default_slot_15(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Installation";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 10, 4, 307);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(10:2) <SCR_ROUTER_LINK to={{ name: \\\"installationRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (13:2) <SCR_ROUTER_LINK to={{ name: "gettingStartedRoute" }}>
    function create_default_slot_14(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Getting Started";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 13, 4, 429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(13:2) <SCR_ROUTER_LINK to={{ name: \\\"gettingStartedRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (17:2) <SCR_ROUTER_LINK to={{ name: "configurationOptionsRoute" }}>
    function create_default_slot_13(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Configuration Options";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 17, 4, 605);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(17:2) <SCR_ROUTER_LINK to={{ name: \\\"configurationOptionsRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (20:2) <SCR_ROUTER_LINK to={{ name: "configurationGlobalBeforeEnterOptionRoute" }}>
    function create_default_slot_12(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Global Before Enter";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 20, 4, 758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(20:2) <SCR_ROUTER_LINK to={{ name: \\\"configurationGlobalBeforeEnterOptionRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <SCR_ROUTER_LINK to={{ name: "configurationOnErrorOptionRoute" }}>
    function create_default_slot_11(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Global On Error";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 23, 4, 899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(23:2) <SCR_ROUTER_LINK to={{ name: \\\"configurationOnErrorOptionRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (27:2) <SCR_ROUTER_LINK to={{ name: "routeObjectOptionsRoute" }}>
    function create_default_slot_10(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Properties";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 27, 4, 1072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(27:2) <SCR_ROUTER_LINK to={{ name: \\\"routeObjectOptionsRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (30:2) <SCR_ROUTER_LINK to={{ name: "routeObjectBeforeEnterRoute" }}>
    function create_default_slot_9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Before Enter";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 30, 4, 1200);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(30:2) <SCR_ROUTER_LINK to={{ name: \\\"routeObjectBeforeEnterRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (33:2) <SCR_ROUTER_LINK to={{ name: "routeObjectAfterBeforeEnterRoute" }}>
    function create_default_slot_8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "After Before Enter";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 33, 4, 1335);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(33:2) <SCR_ROUTER_LINK to={{ name: \\\"routeObjectAfterBeforeEnterRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (36:2) <SCR_ROUTER_LINK to={{ name: "routeObjectOnErrorRoute" }}>
    function create_default_slot_7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "On Error";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 36, 4, 1467);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(36:2) <SCR_ROUTER_LINK to={{ name: \\\"routeObjectOnErrorRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (40:2) <SCR_ROUTER_LINK to={{ name: "routeComponentPropertiesRoute" }}>
    function create_default_slot_6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Properties";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 40, 4, 1642);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(40:2) <SCR_ROUTER_LINK to={{ name: \\\"routeComponentPropertiesRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (43:2) <SCR_ROUTER_LINK to={{ name: "routeComponentComponentsRoute" }}>
    function create_default_slot_5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Components";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 43, 4, 1772);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(43:2) <SCR_ROUTER_LINK to={{ name: \\\"routeComponentComponentsRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (47:2) <SCR_ROUTER_LINK to={{ name: "navigationRoutingRoute" }}>
    function create_default_slot_4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Routing";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 47, 4, 1937);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(47:2) <SCR_ROUTER_LINK to={{ name: \\\"navigationRoutingRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (50:2) <SCR_ROUTER_LINK to={{ name: "navigationStoreRoute" }}>
    function create_default_slot_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Store";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 50, 4, 2055);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(50:2) <SCR_ROUTER_LINK to={{ name: \\\"navigationStoreRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (54:2) <SCR_ROUTER_LINK to={{ name: "routerLinkPropertiesRoute" }}>
    function create_default_slot_2$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Properties";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 54, 4, 2218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(54:2) <SCR_ROUTER_LINK to={{ name: \\\"routerLinkPropertiesRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (58:2) <SCR_ROUTER_LINK to={{ name: "routerStorePropertiesRoute" }}>
    function create_default_slot_1$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Properties";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 58, 4, 2389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(58:2) <SCR_ROUTER_LINK to={{ name: \\\"routerStorePropertiesRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (62:2) <SCR_ROUTER_LINK to={{ name: "test1Route" }}>
    function create_default_slot$j(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test One";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$o, 62, 4, 2539);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$j.name,
    		type: "slot",
    		source: "(62:2) <SCR_ROUTER_LINK to={{ name: \\\"test1Route\\\" }}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div;
    	let h40;
    	let t1;
    	let scr_router_link0;
    	let t2;
    	let scr_router_link1;
    	let t3;
    	let scr_router_link2;
    	let t4;
    	let h41;
    	let t6;
    	let scr_router_link3;
    	let t7;
    	let scr_router_link4;
    	let t8;
    	let scr_router_link5;
    	let t9;
    	let h42;
    	let t11;
    	let scr_router_link6;
    	let t12;
    	let scr_router_link7;
    	let t13;
    	let scr_router_link8;
    	let t14;
    	let scr_router_link9;
    	let t15;
    	let h43;
    	let t17;
    	let scr_router_link10;
    	let t18;
    	let scr_router_link11;
    	let t19;
    	let h44;
    	let t21;
    	let scr_router_link12;
    	let t22;
    	let scr_router_link13;
    	let t23;
    	let h45;
    	let t25;
    	let scr_router_link14;
    	let t26;
    	let h46;
    	let t28;
    	let scr_router_link15;
    	let t29;
    	let h47;
    	let t31;
    	let scr_router_link16;
    	let current;

    	scr_router_link0 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "rootRoute" },
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link1 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "installationRoute" },
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link2 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "gettingStartedRoute" },
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link3 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "configurationOptionsRoute" },
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link4 = new SCR_ROUTER_LINK({
    			props: {
    				to: {
    					name: "configurationGlobalBeforeEnterOptionRoute"
    				},
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link5 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "configurationOnErrorOptionRoute" },
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link6 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectOptionsRoute" },
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link7 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectBeforeEnterRoute" },
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link8 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectAfterBeforeEnterRoute" },
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link9 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectOnErrorRoute" },
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link10 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeComponentPropertiesRoute" },
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link11 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeComponentComponentsRoute" },
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link12 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "navigationRoutingRoute" },
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link13 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "navigationStoreRoute" },
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link14 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routerLinkPropertiesRoute" },
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link15 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routerStorePropertiesRoute" },
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link16 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "test1Route" },
    				$$slots: { default: [create_default_slot$j] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			h40.textContent = "Introduction";
    			t1 = space();
    			create_component(scr_router_link0.$$.fragment);
    			t2 = space();
    			create_component(scr_router_link1.$$.fragment);
    			t3 = space();
    			create_component(scr_router_link2.$$.fragment);
    			t4 = space();
    			h41 = element("h4");
    			h41.textContent = "Configuration";
    			t6 = space();
    			create_component(scr_router_link3.$$.fragment);
    			t7 = space();
    			create_component(scr_router_link4.$$.fragment);
    			t8 = space();
    			create_component(scr_router_link5.$$.fragment);
    			t9 = space();
    			h42 = element("h4");
    			h42.textContent = "Route Object";
    			t11 = space();
    			create_component(scr_router_link6.$$.fragment);
    			t12 = space();
    			create_component(scr_router_link7.$$.fragment);
    			t13 = space();
    			create_component(scr_router_link8.$$.fragment);
    			t14 = space();
    			create_component(scr_router_link9.$$.fragment);
    			t15 = space();
    			h43 = element("h4");
    			h43.textContent = "Route Component";
    			t17 = space();
    			create_component(scr_router_link10.$$.fragment);
    			t18 = space();
    			create_component(scr_router_link11.$$.fragment);
    			t19 = space();
    			h44 = element("h4");
    			h44.textContent = "Navigation";
    			t21 = space();
    			create_component(scr_router_link12.$$.fragment);
    			t22 = space();
    			create_component(scr_router_link13.$$.fragment);
    			t23 = space();
    			h45 = element("h4");
    			h45.textContent = "Route Link";
    			t25 = space();
    			create_component(scr_router_link14.$$.fragment);
    			t26 = space();
    			h46 = element("h4");
    			h46.textContent = "Router Store";
    			t28 = space();
    			create_component(scr_router_link15.$$.fragment);
    			t29 = space();
    			h47 = element("h4");
    			h47.textContent = "Testing";
    			t31 = space();
    			create_component(scr_router_link16.$$.fragment);
    			attr_dev(h40, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h40, file$o, 5, 2, 94);
    			attr_dev(h41, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h41, file$o, 15, 2, 495);
    			attr_dev(h42, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h42, file$o, 25, 2, 965);
    			attr_dev(h43, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h43, file$o, 38, 2, 1526);
    			attr_dev(h44, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h44, file$o, 45, 2, 1833);
    			attr_dev(h45, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h45, file$o, 52, 2, 2111);
    			attr_dev(h46, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h46, file$o, 56, 2, 2279);
    			attr_dev(h47, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h47, file$o, 60, 2, 2450);
    			attr_dev(div, "class", "scr-menu svelte-1y3f1bo");
    			add_location(div, file$o, 4, 0, 69);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(div, t1);
    			mount_component(scr_router_link0, div, null);
    			append_dev(div, t2);
    			mount_component(scr_router_link1, div, null);
    			append_dev(div, t3);
    			mount_component(scr_router_link2, div, null);
    			append_dev(div, t4);
    			append_dev(div, h41);
    			append_dev(div, t6);
    			mount_component(scr_router_link3, div, null);
    			append_dev(div, t7);
    			mount_component(scr_router_link4, div, null);
    			append_dev(div, t8);
    			mount_component(scr_router_link5, div, null);
    			append_dev(div, t9);
    			append_dev(div, h42);
    			append_dev(div, t11);
    			mount_component(scr_router_link6, div, null);
    			append_dev(div, t12);
    			mount_component(scr_router_link7, div, null);
    			append_dev(div, t13);
    			mount_component(scr_router_link8, div, null);
    			append_dev(div, t14);
    			mount_component(scr_router_link9, div, null);
    			append_dev(div, t15);
    			append_dev(div, h43);
    			append_dev(div, t17);
    			mount_component(scr_router_link10, div, null);
    			append_dev(div, t18);
    			mount_component(scr_router_link11, div, null);
    			append_dev(div, t19);
    			append_dev(div, h44);
    			append_dev(div, t21);
    			mount_component(scr_router_link12, div, null);
    			append_dev(div, t22);
    			mount_component(scr_router_link13, div, null);
    			append_dev(div, t23);
    			append_dev(div, h45);
    			append_dev(div, t25);
    			mount_component(scr_router_link14, div, null);
    			append_dev(div, t26);
    			append_dev(div, h46);
    			append_dev(div, t28);
    			mount_component(scr_router_link15, div, null);
    			append_dev(div, t29);
    			append_dev(div, h47);
    			append_dev(div, t31);
    			mount_component(scr_router_link16, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_router_link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link0_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link0.$set(scr_router_link0_changes);
    			const scr_router_link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link1_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link1.$set(scr_router_link1_changes);
    			const scr_router_link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link2_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link2.$set(scr_router_link2_changes);
    			const scr_router_link3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link3_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link3.$set(scr_router_link3_changes);
    			const scr_router_link4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link4_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link4.$set(scr_router_link4_changes);
    			const scr_router_link5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link5_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link5.$set(scr_router_link5_changes);
    			const scr_router_link6_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link6_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link6.$set(scr_router_link6_changes);
    			const scr_router_link7_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link7_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link7.$set(scr_router_link7_changes);
    			const scr_router_link8_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link8_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link8.$set(scr_router_link8_changes);
    			const scr_router_link9_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link9_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link9.$set(scr_router_link9_changes);
    			const scr_router_link10_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link10_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link10.$set(scr_router_link10_changes);
    			const scr_router_link11_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link11_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link11.$set(scr_router_link11_changes);
    			const scr_router_link12_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link12_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link12.$set(scr_router_link12_changes);
    			const scr_router_link13_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link13_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link13.$set(scr_router_link13_changes);
    			const scr_router_link14_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link14_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link14.$set(scr_router_link14_changes);
    			const scr_router_link15_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link15_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link15.$set(scr_router_link15_changes);
    			const scr_router_link16_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link16_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link16.$set(scr_router_link16_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_router_link0.$$.fragment, local);
    			transition_in(scr_router_link1.$$.fragment, local);
    			transition_in(scr_router_link2.$$.fragment, local);
    			transition_in(scr_router_link3.$$.fragment, local);
    			transition_in(scr_router_link4.$$.fragment, local);
    			transition_in(scr_router_link5.$$.fragment, local);
    			transition_in(scr_router_link6.$$.fragment, local);
    			transition_in(scr_router_link7.$$.fragment, local);
    			transition_in(scr_router_link8.$$.fragment, local);
    			transition_in(scr_router_link9.$$.fragment, local);
    			transition_in(scr_router_link10.$$.fragment, local);
    			transition_in(scr_router_link11.$$.fragment, local);
    			transition_in(scr_router_link12.$$.fragment, local);
    			transition_in(scr_router_link13.$$.fragment, local);
    			transition_in(scr_router_link14.$$.fragment, local);
    			transition_in(scr_router_link15.$$.fragment, local);
    			transition_in(scr_router_link16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_link0.$$.fragment, local);
    			transition_out(scr_router_link1.$$.fragment, local);
    			transition_out(scr_router_link2.$$.fragment, local);
    			transition_out(scr_router_link3.$$.fragment, local);
    			transition_out(scr_router_link4.$$.fragment, local);
    			transition_out(scr_router_link5.$$.fragment, local);
    			transition_out(scr_router_link6.$$.fragment, local);
    			transition_out(scr_router_link7.$$.fragment, local);
    			transition_out(scr_router_link8.$$.fragment, local);
    			transition_out(scr_router_link9.$$.fragment, local);
    			transition_out(scr_router_link10.$$.fragment, local);
    			transition_out(scr_router_link11.$$.fragment, local);
    			transition_out(scr_router_link12.$$.fragment, local);
    			transition_out(scr_router_link13.$$.fragment, local);
    			transition_out(scr_router_link14.$$.fragment, local);
    			transition_out(scr_router_link15.$$.fragment, local);
    			transition_out(scr_router_link16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_router_link0);
    			destroy_component(scr_router_link1);
    			destroy_component(scr_router_link2);
    			destroy_component(scr_router_link3);
    			destroy_component(scr_router_link4);
    			destroy_component(scr_router_link5);
    			destroy_component(scr_router_link6);
    			destroy_component(scr_router_link7);
    			destroy_component(scr_router_link8);
    			destroy_component(scr_router_link9);
    			destroy_component(scr_router_link10);
    			destroy_component(scr_router_link11);
    			destroy_component(scr_router_link12);
    			destroy_component(scr_router_link13);
    			destroy_component(scr_router_link14);
    			destroy_component(scr_router_link15);
    			destroy_component(scr_router_link16);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Menu", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_ROUTER_LINK });
    	return [];
    }

    class SCR_Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Menu",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src/docs/SCR_Layout.svelte generated by Svelte v3.37.0 */
    const file$n = "src/docs/SCR_Layout.svelte";
    const get_scr_header_slot_changes = dirty => ({});
    const get_scr_header_slot_context = ctx => ({});

    // (8:28)        
    function fallback_block(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Svelte Client Router - The Svelte SPA Router!";
    			attr_dev(h2, "class", "scr-main-layout__header svelte-lxpf7t");
    			add_location(h2, file$n, 8, 6, 199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(8:28)        ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div6;
    	let div0;
    	let t0;
    	let div2;
    	let scr_menu;
    	let t1;
    	let div1;
    	let div1_intro;
    	let div1_outro;
    	let t2;
    	let div5;
    	let div3;
    	let b0;
    	let t4;
    	let br0;
    	let t5;
    	let br1;
    	let t6;
    	let b1;
    	let t8;
    	let a0;
    	let t10;
    	let div4;
    	let b2;
    	let a1;
    	let t13;
    	let br2;
    	let t14;
    	let br3;
    	let t15;
    	let b3;
    	let a2;
    	let current;
    	const scr_header_slot_template = /*#slots*/ ctx[1].scr_header;
    	const scr_header_slot = create_slot(scr_header_slot_template, ctx, /*$$scope*/ ctx[0], get_scr_header_slot_context);
    	const scr_header_slot_or_fallback = scr_header_slot || fallback_block(ctx);
    	scr_menu = new SCR_Menu({ $$inline: true });
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			if (scr_header_slot_or_fallback) scr_header_slot_or_fallback.c();
    			t0 = space();
    			div2 = element("div");
    			create_component(scr_menu.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t2 = space();
    			div5 = element("div");
    			div3 = element("div");
    			b0 = element("b");
    			b0.textContent = "Last Git Version:";
    			t4 = text(" 1.1.0\n      ");
    			br0 = element("br");
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			b1 = element("b");
    			b1.textContent = "License:";
    			t8 = space();
    			a0 = element("a");
    			a0.textContent = "MIT";
    			t10 = space();
    			div4 = element("div");
    			b2 = element("b");
    			b2.textContent = "Github: ";
    			a1 = element("a");
    			a1.textContent = "https://github.com/arthurgermano/svelte-client-router";
    			t13 = space();
    			br2 = element("br");
    			t14 = space();
    			br3 = element("br");
    			t15 = space();
    			b3 = element("b");
    			b3.textContent = "NPM: ";
    			a2 = element("a");
    			a2.textContent = "https://www.npmjs.com/package/svelte-client-router";
    			attr_dev(div0, "class", "scr-header svelte-lxpf7t");
    			add_location(div0, file$n, 6, 2, 139);
    			attr_dev(div1, "class", "scr-pages svelte-lxpf7t");
    			add_location(div1, file$n, 15, 4, 369);
    			attr_dev(div2, "class", "scr-main svelte-lxpf7t");
    			add_location(div2, file$n, 13, 2, 325);
    			add_location(b0, file$n, 25, 6, 625);
    			add_location(br0, file$n, 26, 6, 662);
    			add_location(br1, file$n, 27, 6, 675);
    			add_location(b1, file$n, 28, 6, 688);
    			attr_dev(a0, "href", "https://en.wikipedia.org/wiki/MIT_License");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$n, 29, 6, 710);
    			attr_dev(div3, "class", "scr-footer-left");
    			add_location(div3, file$n, 24, 4, 589);
    			add_location(b2, file$n, 33, 6, 845);
    			attr_dev(a1, "href", "https://github.com/arthurgermano/svelte-client-router");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$n, 33, 21, 860);
    			add_location(br2, file$n, 37, 6, 1027);
    			add_location(br3, file$n, 38, 6, 1040);
    			add_location(b3, file$n, 39, 6, 1053);
    			attr_dev(a2, "href", "https://www.npmjs.com/package/svelte-client-router");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$n, 39, 18, 1065);
    			attr_dev(div4, "class", "scr-footer-right");
    			add_location(div4, file$n, 32, 4, 808);
    			attr_dev(div5, "class", "scr-footer svelte-lxpf7t");
    			add_location(div5, file$n, 23, 2, 560);
    			attr_dev(div6, "class", "scr-main-layout svelte-lxpf7t");
    			add_location(div6, file$n, 5, 0, 107);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);

    			if (scr_header_slot_or_fallback) {
    				scr_header_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div6, t0);
    			append_dev(div6, div2);
    			mount_component(scr_menu, div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div6, t2);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, b0);
    			append_dev(div3, t4);
    			append_dev(div3, br0);
    			append_dev(div3, t5);
    			append_dev(div3, br1);
    			append_dev(div3, t6);
    			append_dev(div3, b1);
    			append_dev(div3, t8);
    			append_dev(div3, a0);
    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			append_dev(div4, b2);
    			append_dev(div4, a1);
    			append_dev(div4, t13);
    			append_dev(div4, br2);
    			append_dev(div4, t14);
    			append_dev(div4, br3);
    			append_dev(div4, t15);
    			append_dev(div4, b3);
    			append_dev(div4, a2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (scr_header_slot) {
    				if (scr_header_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(scr_header_slot, scr_header_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_scr_header_slot_changes, get_scr_header_slot_context);
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
    			transition_in(scr_menu.$$.fragment, local);
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);

    				if (!div1_intro) div1_intro = create_in_transition(div1, fly, {
    					delay: 201,
    					x: 300,
    					duration: 200,
    					opacity: 0
    				});

    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_header_slot_or_fallback, local);
    			transition_out(scr_menu.$$.fragment, local);
    			transition_out(default_slot, local);
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, fly, { x: 300, duration: 200, opacity: 0 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (scr_header_slot_or_fallback) scr_header_slot_or_fallback.d(detaching);
    			destroy_component(scr_menu);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Layout", slots, ['scr_header','default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fly, SCR_Menu });
    	return [$$scope, slots];
    }

    class SCR_Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Layout",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src/docs/SCR_NotFound.svelte generated by Svelte v3.37.0 */
    const file$m = "src/docs/SCR_NotFound.svelte";

    // (15:2) <SCR_ROUTER_LINK to={{ name: backTo }}>
    function create_default_slot$i(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Back";
    			attr_dev(div, "class", "scr-btn svelte-f7tw5n");
    			add_location(div, file$m, 15, 4, 403);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$i.name,
    		type: "slot",
    		source: "(15:2) <SCR_ROUTER_LINK to={{ name: backTo }}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let center;
    	let p0;
    	let t1;
    	let p1;
    	let t2_value = (/*$routerStore*/ ctx[0].currentLocation || "='(") + "";
    	let t2;
    	let t3;
    	let br;
    	let t4;
    	let scr_router_link;
    	let current;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: /*backTo*/ ctx[1] },
    				$$slots: { default: [create_default_slot$i] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			center = element("center");
    			p0 = element("p");
    			p0.textContent = "Not Found";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			br = element("br");
    			t4 = space();
    			create_component(scr_router_link.$$.fragment);
    			attr_dev(p0, "class", "scr-p svelte-f7tw5n");
    			add_location(p0, file$m, 11, 2, 248);
    			attr_dev(p1, "class", "scr-p-small svelte-f7tw5n");
    			add_location(p1, file$m, 12, 2, 281);
    			add_location(br, file$m, 13, 2, 350);
    			add_location(center, file$m, 10, 0, 237);
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
    			append_dev(center, t3);
    			append_dev(center, br);
    			append_dev(center, t4);
    			mount_component(scr_router_link, center, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$routerStore*/ 1) && t2_value !== (t2_value = (/*$routerStore*/ ctx[0].currentLocation || "='(") + "")) set_data_dev(t2, t2_value);
    			const scr_router_link_changes = {};
    			if (dirty & /*backTo*/ 2) scr_router_link_changes.to = { name: /*backTo*/ ctx[1] };

    			if (dirty & /*$$scope*/ 4) {
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
    			if (detaching) detach_dev(center);
    			destroy_component(scr_router_link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let $routerStore;
    	validate_store(routerStore, "routerStore");
    	component_subscribe($$self, routerStore, $$value => $$invalidate(0, $routerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_NotFound", slots, []);
    	let backTo = "/rootRoute";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		routerStore,
    		SCR_ROUTER_LINK,
    		backTo,
    		$routerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("backTo" in $$props) $$invalidate(1, backTo = $$props.backTo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$routerStore*/ 1) {
    			if ($routerStore.currentRoute) {
    				$$invalidate(1, backTo = $routerStore.currentRoute.name);
    			}
    		}
    	};

    	return [$routerStore, backTo];
    }

    class SCR_NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_NotFound",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src/docs/SCR_Error.svelte generated by Svelte v3.37.0 */
    const file$l = "src/docs/SCR_Error.svelte";

    // (17:2) <SCR_ROUTER_LINK to={{ name: backTo }}>
    function create_default_slot$h(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Back";
    			attr_dev(div, "class", "scr-btn svelte-dz0sst");
    			add_location(div, file$l, 17, 4, 428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$h.name,
    		type: "slot",
    		source: "(17:2) <SCR_ROUTER_LINK to={{ name: backTo }}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let center;
    	let p0;
    	let t1;
    	let p1;
    	let t2;
    	let t3;
    	let br;
    	let t4;
    	let scr_router_link;
    	let current;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: /*backTo*/ ctx[1] },
    				$$slots: { default: [create_default_slot$h] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			center = element("center");
    			p0 = element("p");
    			p0.textContent = "Error";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(/*errorMessage*/ ctx[0]);
    			t3 = space();
    			br = element("br");
    			t4 = space();
    			create_component(scr_router_link.$$.fragment);
    			attr_dev(p0, "class", "scr-p svelte-dz0sst");
    			add_location(p0, file$l, 13, 2, 302);
    			attr_dev(p1, "class", "scr-p-small svelte-dz0sst");
    			add_location(p1, file$l, 14, 2, 331);
    			add_location(br, file$l, 15, 2, 375);
    			add_location(center, file$l, 12, 0, 291);
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
    			append_dev(center, t3);
    			append_dev(center, br);
    			append_dev(center, t4);
    			mount_component(scr_router_link, center, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*errorMessage*/ 1) set_data_dev(t2, /*errorMessage*/ ctx[0]);
    			const scr_router_link_changes = {};
    			if (dirty & /*backTo*/ 2) scr_router_link_changes.to = { name: /*backTo*/ ctx[1] };

    			if (dirty & /*$$scope*/ 8) {
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
    			if (detaching) detach_dev(center);
    			destroy_component(scr_router_link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let $routerStore;
    	validate_store(routerStore, "routerStore");
    	component_subscribe($$self, routerStore, $$value => $$invalidate(2, $routerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Error", slots, []);
    	let { errorMessage = "An error has occured!" } = $$props;
    	let backTo = "/rootRoute";
    	const writable_props = ["errorMessage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Error> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("errorMessage" in $$props) $$invalidate(0, errorMessage = $$props.errorMessage);
    	};

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		routerStore,
    		errorMessage,
    		backTo,
    		$routerStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("errorMessage" in $$props) $$invalidate(0, errorMessage = $$props.errorMessage);
    		if ("backTo" in $$props) $$invalidate(1, backTo = $$props.backTo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$routerStore*/ 4) {
    			if ($routerStore.currentRoute) {
    				$$invalidate(1, backTo = $routerStore.currentRoute.name);
    			}
    		}
    	};

    	return [errorMessage, backTo, $routerStore];
    }

    class SCR_Error extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { errorMessage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Error",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get errorMessage() {
    		throw new Error("<SCR_Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorMessage(value) {
    		throw new Error("<SCR_Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;

    function create_fragment$l(ctx) {
    	let scr_router_component;
    	let updating_routes;
    	let current;

    	function scr_router_component_routes_binding(value) {
    		/*scr_router_component_routes_binding*/ ctx[1](value);
    	}

    	let scr_router_component_props = {
    		defaultLayoutComponent: SCR_Layout,
    		notFoundComponent: SCR_NotFound,
    		errorComponent: SCR_Error
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
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	SCR_CONFIG_STORE.setNotFoundRoute("/svelte-client-router/myCustomNotFoundRoute");
    	SCR_CONFIG_STORE.setErrorRoute("/svelte-client-router/myCustomErrorRoute");
    	SCR_CONFIG_STORE.setConsoleLogStores(false);
    	SCR_CONFIG_STORE.setNavigationHistoryLimit(10);
    	SCR_CONFIG_STORE.setHashMode(true);
    	SCR_CONFIG_STORE.setUseScroll(true);
    	SCR_CONFIG_STORE.setConsiderTrailingSlashOnMatchingRoute(true);

    	SCR_CONFIG_STORE.setScrollProps({
    		top: 0,
    		left: 0,
    		behavior: "smooth",
    		timeout: 10
    	});

    	// Setting global error function
    	// https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/configurationOnError
    	SCR_CONFIG_STORE.setOnError((err, routeObjParams) => {
    		console.log("GLOBAL ERROR CONFIG", routeObjParams);
    	});

    	// Setting the route object definition
    	// https://arthurgermano.github.io/svelte-client-router/#/svelte-client-router/routeObjectOptions
    	let routes = [
    		{
    			name: "root",
    			path: "/",
    			beforeEnter: [
    				(resolve, rFrom, rTo, params, payload) => {
    					resolve({ redirect: "/svelte-client-router" });
    				}
    			]
    		},
    		{
    			name: "rootRoute",
    			path: "/svelte-client-router",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_Presentation$1; }),
    			title: "SCR - Presentation"
    		},
    		{
    			name: "installationRoute",
    			path: "/svelte-client-router/installation",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_Installation$1; }),
    			title: "SCR - Installation"
    		},
    		{
    			name: "gettingStartedRoute",
    			path: "/svelte-client-router/gettingStarted",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_GettingStarted$1; }),
    			title: "SCR - Getting Started"
    		},
    		{
    			name: "configurationOptionsRoute",
    			path: "/svelte-client-router/configurationOptions",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_ConfigurationOptions$1; }),
    			title: "SCR - Configuration Options"
    		},
    		{
    			name: "configurationGlobalBeforeEnterOptionRoute",
    			path: "/svelte-client-router/configurationBeforeEnter",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_ConfigurationBeforeEnter$1; }),
    			title: "SCR - Configuration - Before Enter"
    		},
    		{
    			name: "configurationOnErrorOptionRoute",
    			path: "/svelte-client-router/configurationOnError",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_ConfigurationOnError$1; }),
    			title: "SCR - Configuration - On Error"
    		},
    		{
    			name: "routeObjectOptionsRoute",
    			path: "/svelte-client-router/routeObjectOptions",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_RouteObjectProperties$1; }),
    			title: "SCR - Route Object - Options"
    		},
    		{
    			name: "routeObjectBeforeEnterRoute",
    			path: "/svelte-client-router/routeObjectBeforeEnter",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_RouteObjectBeforeEnter$1; }),
    			title: "SCR - Route Object - Before Enter Functions"
    		},
    		{
    			name: "routeObjectAfterBeforeEnterRoute",
    			path: "/svelte-client-router/routeObjectAfterBeforeEnter",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_RouteObjectAfterBeforeEnter$1; }),
    			title: "SCR - Route Object - After Before Function"
    		},
    		{
    			name: "routeObjectOnErrorRoute",
    			path: "/svelte-client-router/routeObjectOnError",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_RouteObjectOnError$1; }),
    			title: "SCR - Route Object - On Error Function"
    		},
    		{
    			name: "routeComponentPropertiesRoute",
    			path: "/svelte-client-router/routeComponentProperties",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_RouteComponentProperties$1; }),
    			title: "SCR - Route Component - Properties"
    		},
    		{
    			name: "routeComponentComponentsRoute",
    			path: "/svelte-client-router/routeComponentComponents",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_RouteComponentComponents$1; }),
    			title: "SCR - Route Component - Components"
    		},
    		{
    			name: "navigationRoutingRoute",
    			path: "/svelte-client-router/navigationRouting",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_NavigationRouting$1; }),
    			title: "SCR - Navigation - Routing"
    		},
    		{
    			name: "navigationStoreRoute",
    			path: "/svelte-client-router/navigationStore",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_NavigationStore$1; }),
    			title: "SCR - Navigation - Store"
    		},
    		{
    			name: "routerLinkPropertiesRoute",
    			path: "/svelte-client-router/routerLinkProperties",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_RouterLinkProperties$1; }),
    			title: "SCR - Route Link - Properties"
    		},
    		{
    			name: "routerStorePropertiesRoute",
    			path: "/svelte-client-router/routerStoreProperties",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_RouterStoreProperties$1; }),
    			title: "SCR - Route Store - Properties"
    		},
    		{
    			name: "test1Route",
    			path: "/svelte-client-router/:teste/test1",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_Test1$1; }),
    			title: "SCR - Test 1",
    			forceReload: true
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
    		SCR_Layout,
    		SCR_NotFound,
    		SCR_Error,
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
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    /* src/docs/SCR_PageFooter.svelte generated by Svelte v3.37.0 */

    const file$k = "src/docs/SCR_PageFooter.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let hr;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			hr = element("hr");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$k, 1, 2, 27);
    			attr_dev(div, "class", "scr-footer svelte-rxr6jj");
    			add_location(div, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, hr);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
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
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_PageFooter", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_PageFooter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class SCR_PageFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_PageFooter",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/docs/components/SCR_PushRouteButton.svelte generated by Svelte v3.37.0 */
    const file$j = "src/docs/components/SCR_PushRouteButton.svelte";

    function create_fragment$j(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(button, "title", /*title*/ ctx[2]);
    			attr_dev(button, "style", /*style*/ ctx[1]);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn scr-button");
    			add_location(button, file$j, 12, 0, 238);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*go*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*title*/ 4) {
    				attr_dev(button, "title", /*title*/ ctx[2]);
    			}

    			if (dirty & /*style*/ 2) {
    				attr_dev(button, "style", /*style*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_PushRouteButton", slots, []);
    	let { routeName = "rootRoute" } = $$props;
    	let { text = "Button" } = $$props;
    	let { style = "" } = $$props;
    	let { title } = $$props;

    	function go() {
    		pushRoute({ name: routeName });
    	}

    	const writable_props = ["routeName", "text", "style", "title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_PushRouteButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("routeName" in $$props) $$invalidate(4, routeName = $$props.routeName);
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("style" in $$props) $$invalidate(1, style = $$props.style);
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({
    		pushRoute,
    		routeName,
    		text,
    		style,
    		title,
    		go
    	});

    	$$self.$inject_state = $$props => {
    		if ("routeName" in $$props) $$invalidate(4, routeName = $$props.routeName);
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("style" in $$props) $$invalidate(1, style = $$props.style);
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, style, title, go, routeName];
    }

    class SCR_PushRouteButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			routeName: 4,
    			text: 0,
    			style: 1,
    			title: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_PushRouteButton",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[2] === undefined && !("title" in props)) {
    			console.warn("<SCR_PushRouteButton> was created without expected prop 'title'");
    		}
    	}

    	get routeName() {
    		throw new Error("<SCR_PushRouteButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routeName(value) {
    		throw new Error("<SCR_PushRouteButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SCR_PushRouteButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SCR_PushRouteButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<SCR_PushRouteButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<SCR_PushRouteButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<SCR_PushRouteButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SCR_PushRouteButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/docs/pages/SCR_Presentation.svelte generated by Svelte v3.37.0 */
    const file$i = "src/docs/pages/SCR_Presentation.svelte";

    // (71:2) <SCR_PageFooter>
    function create_default_slot$g(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton;
    	let current;

    	scr_pushroutebutton = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "installationRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$i, 72, 6, 2604);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$i, 71, 4, 2580);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(71:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let p0;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let br2;
    	let t5;
    	let br3;
    	let t6;
    	let t7;
    	let ul;
    	let li0;
    	let t9;
    	let li1;
    	let t11;
    	let li2;
    	let t12;
    	let b0;
    	let u0;
    	let t14;
    	let t15;
    	let li3;
    	let t16;
    	let b1;
    	let u1;
    	let t18;
    	let t19;
    	let li4;
    	let t21;
    	let li5;
    	let t23;
    	let li6;
    	let t25;
    	let li7;
    	let t27;
    	let li8;
    	let t29;
    	let li9;
    	let t31;
    	let li10;
    	let t33;
    	let li11;
    	let t35;
    	let p1;
    	let t36;
    	let br4;
    	let t37;
    	let br5;
    	let t38;
    	let br6;
    	let t39;
    	let t40;
    	let center;
    	let small;
    	let t42;
    	let pre;
    	let t44;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$g] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Presentation";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Hi.. This is The Svelte Router - thought to be focused on controlling what\n    happens before entering the route.\n    ");
    			br0 = element("br");
    			t3 = space();
    			br1 = element("br");
    			t4 = text("\n    The motivation to develop this router was that, until now, there isn't a nice\n    router for svelte. When we think on routing what do we want? Did you stop do\n    think about it?\n    ");
    			br2 = element("br");
    			t5 = space();
    			br3 = element("br");
    			t6 = text("\n    Let's see what we thought...");
    			t7 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Lazy Load Components and Layouts";
    			t9 = space();
    			li1 = element("li");
    			li1.textContent = "Global and Per Route Layout";
    			t11 = space();
    			li2 = element("li");
    			t12 = text("Execute something Before Enter ");
    			b0 = element("b");
    			u0 = element("u");
    			u0.textContent = "The";
    			t14 = text(" Route");
    			t15 = space();
    			li3 = element("li");
    			t16 = text("Execute something Before Enter ");
    			b1 = element("b");
    			u1 = element("u");
    			u1.textContent = "Each";
    			t18 = text(" Route");
    			t19 = space();
    			li4 = element("li");
    			li4.textContent = "The possibility to ignore global before enter on a single route";
    			t21 = space();
    			li5 = element("li");
    			li5.textContent = "A Loading Component To Keep Our Users Waiting";
    			t23 = space();
    			li6 = element("li");
    			li6.textContent = "A Error Component To land when something goes wrong";
    			t25 = space();
    			li7 = element("li");
    			li7.textContent = "A Not Found Component To land when the user try to enter a not existing\n      route";
    			t27 = space();
    			li8 = element("li");
    			li8.textContent = "Customize this routes and components at our will";
    			t29 = space();
    			li9 = element("li");
    			li9.textContent = "To set the title automatically";
    			t31 = space();
    			li10 = element("li");
    			li10.textContent = "To pass information between Before Enter Function and send to Route Loaded\n      Components";
    			t33 = space();
    			li11 = element("li");
    			li11.textContent = "The possibility to use hash routing";
    			t35 = space();
    			p1 = element("p");
    			t36 = text("Not only that is important but to control the overall behaviour when routing.\n    Where to set the scroll position, reload the route everytime or just when I\n    am not in the route - this may prevent some looping issues in your\n    application.\n    ");
    			br4 = element("br");
    			t37 = space();
    			br5 = element("br");
    			t38 = text("\n    Anyway a lot of cool stuff when routing. So in each section it will be provided\n    the configuration used to configure each route ok? See below the configuration\n    for this first route. \n    ");
    			br6 = element("br");
    			t39 = text("\n    Pretty simple isn't it ?");
    			t40 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t42 = space();
    			pre = element("pre");
    			pre.textContent = "{\n      name: \"rootRoute\",\n      path: \"/svelte-client-router\",\n      lazyLoadComponent: () => import(\"./docs/pages/SCR_Presentation.svelte\"),\n      title: \"SCR - Presentation\",\n}";
    			t44 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$i, 6, 2, 180);
    			add_location(br0, file$i, 10, 4, 370);
    			add_location(br1, file$i, 11, 4, 381);
    			add_location(br2, file$i, 15, 4, 575);
    			add_location(br3, file$i, 16, 4, 586);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$i, 7, 2, 219);
    			attr_dev(li0, "class", "scr-li svelte-1kf261k");
    			add_location(li0, file$i, 20, 4, 644);
    			attr_dev(li1, "class", "scr-li svelte-1kf261k");
    			add_location(li1, file$i, 21, 4, 705);
    			add_location(u0, file$i, 23, 40, 821);
    			add_location(b0, file$i, 23, 37, 818);
    			attr_dev(li2, "class", "scr-li svelte-1kf261k");
    			add_location(li2, file$i, 22, 4, 761);
    			add_location(u1, file$i, 26, 40, 916);
    			add_location(b1, file$i, 26, 37, 913);
    			attr_dev(li3, "class", "scr-li svelte-1kf261k");
    			add_location(li3, file$i, 25, 4, 856);
    			attr_dev(li4, "class", "scr-li svelte-1kf261k");
    			add_location(li4, file$i, 28, 4, 952);
    			attr_dev(li5, "class", "scr-li svelte-1kf261k");
    			add_location(li5, file$i, 31, 4, 1056);
    			attr_dev(li6, "class", "scr-li svelte-1kf261k");
    			add_location(li6, file$i, 32, 4, 1130);
    			attr_dev(li7, "class", "scr-li svelte-1kf261k");
    			add_location(li7, file$i, 33, 4, 1210);
    			attr_dev(li8, "class", "scr-li svelte-1kf261k");
    			add_location(li8, file$i, 37, 4, 1334);
    			attr_dev(li9, "class", "scr-li svelte-1kf261k");
    			add_location(li9, file$i, 38, 4, 1411);
    			attr_dev(li10, "class", "scr-li svelte-1kf261k");
    			add_location(li10, file$i, 39, 4, 1470);
    			attr_dev(li11, "class", "scr-li svelte-1kf261k");
    			add_location(li11, file$i, 43, 4, 1602);
    			add_location(ul, file$i, 19, 2, 635);
    			add_location(br4, file$i, 50, 4, 1955);
    			add_location(br5, file$i, 51, 4, 1966);
    			add_location(br6, file$i, 55, 4, 2171);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$i, 45, 2, 1672);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$i, 59, 4, 2248);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$i, 58, 2, 2216);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file$i, 61, 2, 2329);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$i, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, br0);
    			append_dev(p0, t3);
    			append_dev(p0, br1);
    			append_dev(p0, t4);
    			append_dev(p0, br2);
    			append_dev(p0, t5);
    			append_dev(p0, br3);
    			append_dev(p0, t6);
    			append_dev(div, t7);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t9);
    			append_dev(ul, li1);
    			append_dev(ul, t11);
    			append_dev(ul, li2);
    			append_dev(li2, t12);
    			append_dev(li2, b0);
    			append_dev(b0, u0);
    			append_dev(li2, t14);
    			append_dev(ul, t15);
    			append_dev(ul, li3);
    			append_dev(li3, t16);
    			append_dev(li3, b1);
    			append_dev(b1, u1);
    			append_dev(li3, t18);
    			append_dev(ul, t19);
    			append_dev(ul, li4);
    			append_dev(ul, t21);
    			append_dev(ul, li5);
    			append_dev(ul, t23);
    			append_dev(ul, li6);
    			append_dev(ul, t25);
    			append_dev(ul, li7);
    			append_dev(ul, t27);
    			append_dev(ul, li8);
    			append_dev(ul, t29);
    			append_dev(ul, li9);
    			append_dev(ul, t31);
    			append_dev(ul, li10);
    			append_dev(ul, t33);
    			append_dev(ul, li11);
    			append_dev(div, t35);
    			append_dev(div, p1);
    			append_dev(p1, t36);
    			append_dev(p1, br4);
    			append_dev(p1, t37);
    			append_dev(p1, br5);
    			append_dev(p1, t38);
    			append_dev(p1, br6);
    			append_dev(p1, t39);
    			append_dev(div, t40);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t42);
    			append_dev(div, pre);
    			append_dev(div, t44);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Presentation", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Presentation> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_Presentation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Presentation",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    var SCR_Presentation$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_Presentation
    });

    /* src/docs/pages/SCR_Installation.svelte generated by Svelte v3.37.0 */
    const file$h = "src/docs/pages/SCR_Installation.svelte";

    // (45:2) <SCR_PageFooter>
    function create_default_slot$f(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "rootRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "gettingStartedRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$h, 46, 6, 1246);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$h, 45, 4, 1222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(45:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let h50;
    	let t3;
    	let pre0;
    	let t5;
    	let h51;
    	let t7;
    	let pre1;
    	let b0;
    	let t9;
    	let t10;
    	let center;
    	let small;
    	let t12;
    	let pre2;
    	let b1;
    	let t14;
    	let t15;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Installation";
    			t1 = space();
    			h50 = element("h5");
    			h50.textContent = "Via npm:";
    			t3 = space();
    			pre0 = element("pre");
    			pre0.textContent = "npm install svelte-client-router";
    			t5 = space();
    			h51 = element("h5");
    			h51.textContent = "Importing in your code:";
    			t7 = space();
    			pre1 = element("pre");
    			b0 = element("b");
    			b0.textContent = "// This is just an example of all possibilities exported by the package";
    			t9 = text("\nimport {  \n    SCR_ROUTER_COMPONENT,\n    SCR_ROUTER_LINK,\n    SCR_ROUTER_STORE,\n    SCR_CONFIG_STORE,\n    SCR_NAVIGATE_STORE,\n    pushRoute,\n    backRoute,\n} from \"svelte-client-router\"");
    			t10 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t12 = space();
    			pre2 = element("pre");
    			b1 = element("b");
    			b1.textContent = "// This is an example of one route declaration.\n// This object must go inside of an array.\n// See the next chapter for more info!";
    			t14 = text("\n{\n    name: \"installationRoute\",\n    path: \"/svelte-client-router/installation\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_Installation.svelte\"),\n    title: \"SCR - Installation\",\n}");
    			t15 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$h, 6, 2, 180);
    			add_location(h50, file$h, 7, 2, 219);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$h, 8, 2, 239);
    			add_location(h51, file$h, 11, 2, 309);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$h, 14, 4, 374);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$h, 12, 2, 344);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$h, 28, 4, 718);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$h, 27, 2, 686);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$h, 32, 4, 829);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$h, 30, 2, 799);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$h, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, h50);
    			append_dev(div, t3);
    			append_dev(div, pre0);
    			append_dev(div, t5);
    			append_dev(div, h51);
    			append_dev(div, t7);
    			append_dev(div, pre1);
    			append_dev(pre1, b0);
    			append_dev(pre1, t9);
    			append_dev(div, t10);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t12);
    			append_dev(div, pre2);
    			append_dev(pre2, b1);
    			append_dev(pre2, t14);
    			append_dev(div, t15);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Installation", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Installation> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_Installation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Installation",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    var SCR_Installation$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_Installation
    });

    /* src/docs/pages/SCR_GettingStarted.svelte generated by Svelte v3.37.0 */
    const file$g = "src/docs/pages/SCR_GettingStarted.svelte";

    // (147:2) <SCR_PageFooter>
    function create_default_slot$e(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "installationRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "configurationOptionsRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$g, 148, 6, 4596);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$g, 147, 4, 4572);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(147:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let h50;
    	let t3;
    	let pre0;
    	let t4;
    	let b0;
    	let t6;
    	let b1;
    	let t7;
    	let a0;
    	let t9;
    	let t10;
    	let br0;
    	let t11;
    	let h51;
    	let t13;
    	let pre1;
    	let t15;
    	let br1;
    	let t16;
    	let h52;
    	let t18;
    	let pre2;
    	let t20;
    	let p;
    	let t21;
    	let br2;
    	let t22;
    	let br3;
    	let t23;
    	let t24;
    	let br4;
    	let t25;
    	let h53;
    	let t27;
    	let pre3;
    	let b2;
    	let t29;
    	let b3;
    	let t31;
    	let b4;
    	let t33;
    	let b5;
    	let t34;
    	let a1;
    	let t36;
    	let b6;
    	let t38;
    	let b7;
    	let t40;
    	let b8;
    	let t42;
    	let b9;
    	let t44;
    	let t45;
    	let center;
    	let small;
    	let t47;
    	let pre4;
    	let t49;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Getting Started";
    			t1 = space();
    			h50 = element("h5");
    			h50.textContent = "Loading The Svelte Client Router";
    			t3 = space();
    			pre0 = element("pre");
    			t4 = text("import {  \n    SCR_ROUTER_COMPONENT,\n    SCR_ROUTER_LINK,\n    SCR_ROUTER_STORE,\n    SCR_CONFIG_STORE,\n    SCR_NAVIGATE_STORE,\n    pushRoute,\n    backRoute,\n} from \"svelte-client-router\"\n\n");
    			b0 = element("b");
    			b0.textContent = "// Make sure to declare the default slot \"<slot />\" inside of your layout component";
    			t6 = text("\n");
    			b1 = element("b");
    			t7 = text("// ");
    			a0 = element("a");
    			a0.textContent = "For more info about Svelte Slots";
    			t9 = text("\nimport MY_LAYOUT from \"./path/to/my/MY_LAYOUT.svelte\";");
    			t10 = space();
    			br0 = element("br");
    			t11 = space();
    			h51 = element("h5");
    			h51.textContent = "Declaring Routes";
    			t13 = space();
    			pre1 = element("pre");
    			pre1.textContent = "const routes = [\n    {\n      name: \"root\",\n      path: \"/\",\n      beforeEnter: [\n        (resolve, rFrom, rTo, params, payload) => {\n          resolve({ redirect: \"/svelte-client-router\" } );\n        } ,\n      ],\n    } ,\n    {\n      name: \"rootRoute\",\n      path: \"/svelte-client-router\",\n      lazyLoadComponent: () => import(\"./docs/pages/SCR_Presentation.svelte\"),\n      title: \"SCR - Presentation\",\n    } ,\n    {\n      name: \"installationRoute\",\n      path: \"/svelte-client-router/installation\",\n      lazyLoadComponent: () => import(\"./docs/pages/SCR_Installation.svelte\"),\n      title: \"SCR - Installation\",\n    } ,\n    {\n      name: \"gettingStartedRoute\",\n      path: \"/svelte-client-router/gettingStarted\",\n      lazyLoadComponent: () => import(\"./docs/pages/SCR_GettingStarted.svelte\"),\n      title: \"SCR - Getting Started\",\n    } ,\n  ];\n}";
    			t15 = space();
    			br1 = element("br");
    			t16 = space();
    			h52 = element("h5");
    			h52.textContent = "Using The Component";
    			t18 = space();
    			pre2 = element("pre");
    			pre2.textContent = "<SCR_ROUTER_COMPONENT bind:routes defaultLayoutComponent={MY_LAYOUT} />";
    			t20 = space();
    			p = element("p");
    			t21 = text("That is it. We are ready to route our application.\n    ");
    			br2 = element("br");
    			t22 = space();
    			br3 = element("br");
    			t23 = text("\n    Of course this is a very basic configuration though. Go through the next sections\n    to learn about more advanced settings.");
    			t24 = space();
    			br4 = element("br");
    			t25 = space();
    			h53 = element("h5");
    			h53.textContent = "Full Example";
    			t27 = space();
    			pre3 = element("pre");
    			b2 = element("b");
    			b2.textContent = "// Svelte Component";
    			t29 = text("\n<script>\n\n");
    			b3 = element("b");
    			b3.textContent = "// Importing Svelte Client Router";
    			t31 = text("\nimport {  \n    SCR_ROUTER_COMPONENT,\n    SCR_ROUTER_LINK,\n    SCR_ROUTER_STORE,\n    SCR_CONFIG_STORE,\n    SCR_NAVIGATE_STORE,\n    pushRoute,\n    backRoute,\n} from \"svelte-client-router\"\n\n");
    			b4 = element("b");
    			b4.textContent = "// Make sure to declare the default slot \"<slot />\" inside of your layout component";
    			t33 = text("\n");
    			b5 = element("b");
    			t34 = text("// ");
    			a1 = element("a");
    			a1.textContent = "For more info about Svelte Slots";
    			t36 = text("\n");
    			b6 = element("b");
    			b6.textContent = "// Importing My Very Nice Layout";
    			t38 = text("\nimport MY_LAYOUT from \"./path/to/my/MY_LAYOUT.svelte\";\n\n");
    			b7 = element("b");
    			b7.textContent = "// Setting Routes";
    			t40 = text("\nconst routes = [\n    {\n      ");
    			b8 = element("b");
    			b8.textContent = "// Doesn't declare a component because it redirects only!";
    			t42 = text("\n      name: \"root\",\n      path: \"/\",\n      beforeEnter: [\n        (resolve, rFrom, rTo, params, payload) => {\n          resolve({ redirect: \"/svelte-client-router\" } );\n        } ,\n      ],\n    } ,\n    {\n      name: \"rootRoute\",\n      path: \"/svelte-client-router\",\n      lazyLoadComponent: () => import(\"./docs/pages/SCR_Presentation.svelte\"),\n      title: \"SCR - Presentation\",\n    } ,\n    {\n      name: \"installationRoute\",\n      path: \"/svelte-client-router/installation\",\n      lazyLoadComponent: () => import(\"./docs/pages/SCR_Installation.svelte\"),\n      title: \"SCR - Installation\",\n    } ,\n    {\n      name: \"gettingStartedRoute\",\n      path: \"/svelte-client-router/gettingStarted\",\n      lazyLoadComponent: () => import(\"./docs/pages/SCR_GettingStarted.svelte\"),\n      title: \"SCR - Getting Started\",\n    } ,\n  ];\n}\n\n<script> \n\n");
    			b9 = element("b");
    			b9.textContent = "<!-- Using SCR Router Component - passing routes and my custom layout -->";
    			t44 = text("\n<SCR_ROUTER_COMPONENT bind:routes defaultLayoutComponent={MY_LAYOUT} />");
    			t45 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t47 = space();
    			pre4 = element("pre");
    			pre4.textContent = "{\n    name: \"gettingStartedRoute\",\n    path: \"/svelte-client-router/gettingStarted\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_GettingStarted.svelte\"),\n    title: \"SCR - Getting Started\",\n}";
    			t49 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$g, 6, 2, 180);
    			add_location(h50, file$g, 7, 2, 222);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$g, 20, 0, 493);
    			attr_dev(a0, "href", "https://svelte.dev/tutorial/slots");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$g, 21, 20, 624);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$g, 21, 0, 604);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$g, 8, 2, 266);
    			add_location(br0, file$g, 24, 2, 791);
    			add_location(h51, file$g, 25, 2, 800);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$g, 26, 2, 828);
    			add_location(br1, file$g, 59, 2, 1796);
    			add_location(h52, file$g, 60, 2, 1805);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$g, 61, 2, 1836);
    			add_location(br2, file$g, 67, 4, 2053);
    			add_location(br3, file$g, 68, 4, 2064);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$g, 65, 2, 1965);
    			add_location(br4, file$g, 72, 2, 2209);
    			add_location(h53, file$g, 73, 2, 2218);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$g, 76, 0, 2268);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$g, 79, 0, 2325);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$g, 90, 0, 2577);
    			attr_dev(a1, "href", "https://svelte.dev/tutorial/slots");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$g, 91, 20, 2708);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$g, 91, 0, 2688);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$g, 92, 0, 2809);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$g, 95, 0, 2919);
    			attr_dev(b8, "class", "scr-b");
    			add_location(b8, file$g, 98, 6, 2992);
    			attr_dev(b9, "class", "scr-b");
    			add_location(b9, file$g, 130, 0, 3987);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$g, 74, 2, 2242);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$g, 134, 4, 4219);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$g, 133, 2, 4187);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$g, 136, 2, 4300);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$g, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, h50);
    			append_dev(div, t3);
    			append_dev(div, pre0);
    			append_dev(pre0, t4);
    			append_dev(pre0, b0);
    			append_dev(pre0, t6);
    			append_dev(pre0, b1);
    			append_dev(b1, t7);
    			append_dev(b1, a0);
    			append_dev(pre0, t9);
    			append_dev(div, t10);
    			append_dev(div, br0);
    			append_dev(div, t11);
    			append_dev(div, h51);
    			append_dev(div, t13);
    			append_dev(div, pre1);
    			append_dev(div, t15);
    			append_dev(div, br1);
    			append_dev(div, t16);
    			append_dev(div, h52);
    			append_dev(div, t18);
    			append_dev(div, pre2);
    			append_dev(div, t20);
    			append_dev(div, p);
    			append_dev(p, t21);
    			append_dev(p, br2);
    			append_dev(p, t22);
    			append_dev(p, br3);
    			append_dev(p, t23);
    			append_dev(div, t24);
    			append_dev(div, br4);
    			append_dev(div, t25);
    			append_dev(div, h53);
    			append_dev(div, t27);
    			append_dev(div, pre3);
    			append_dev(pre3, b2);
    			append_dev(pre3, t29);
    			append_dev(pre3, b3);
    			append_dev(pre3, t31);
    			append_dev(pre3, b4);
    			append_dev(pre3, t33);
    			append_dev(pre3, b5);
    			append_dev(b5, t34);
    			append_dev(b5, a1);
    			append_dev(pre3, t36);
    			append_dev(pre3, b6);
    			append_dev(pre3, t38);
    			append_dev(pre3, b7);
    			append_dev(pre3, t40);
    			append_dev(pre3, b8);
    			append_dev(pre3, t42);
    			append_dev(pre3, b9);
    			append_dev(pre3, t44);
    			append_dev(div, t45);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t47);
    			append_dev(div, pre4);
    			append_dev(div, t49);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_GettingStarted", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_GettingStarted> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_GettingStarted extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_GettingStarted",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    var SCR_GettingStarted$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_GettingStarted
    });

    /* src/docs/pages/SCR_ConfigurationOptions.svelte generated by Svelte v3.37.0 */
    const file$f = "src/docs/pages/SCR_ConfigurationOptions.svelte";

    // (375:2) <SCR_PageFooter>
    function create_default_slot$d(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "gettingStartedRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "configurationGlobalBeforeEnterOptionRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$f, 376, 6, 12556);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$f, 375, 4, 12532);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(375:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let h40;
    	let t1;
    	let p0;
    	let t2;
    	let a;
    	let t4;
    	let t5;
    	let h5;
    	let t7;
    	let pre0;
    	let b0;
    	let t9;
    	let t10;
    	let p1;
    	let t12;
    	let hr0;
    	let t13;
    	let h41;
    	let t15;
    	let p2;
    	let t16;
    	let b1;
    	let t18;
    	let b2;
    	let t20;
    	let br0;
    	let t21;
    	let br1;
    	let t22;
    	let t23;
    	let pre1;
    	let b3;
    	let t25;
    	let b4;
    	let t27;
    	let t28;
    	let hr1;
    	let t29;
    	let h42;
    	let t31;
    	let p3;
    	let t32;
    	let b5;
    	let t34;
    	let br2;
    	let t35;
    	let br3;
    	let t36;
    	let t37;
    	let pre2;
    	let b6;
    	let t39;
    	let b7;
    	let t41;
    	let t42;
    	let hr2;
    	let t43;
    	let h43;
    	let t45;
    	let p4;
    	let t46;
    	let b8;
    	let t48;
    	let t49;
    	let ul0;
    	let li0;
    	let b9;
    	let t51;
    	let t52;
    	let li1;
    	let b10;
    	let t54;
    	let t55;
    	let li2;
    	let b11;
    	let t57;
    	let t58;
    	let p5;
    	let t60;
    	let pre3;
    	let b12;
    	let t62;
    	let b13;
    	let t64;
    	let t65;
    	let hr3;
    	let t66;
    	let h44;
    	let t68;
    	let p6;
    	let t69;
    	let b14;
    	let t71;
    	let br4;
    	let t72;
    	let br5;
    	let t73;
    	let b15;
    	let t75;
    	let pre4;
    	let b16;
    	let t77;
    	let b17;
    	let t79;
    	let t80;
    	let hr4;
    	let t81;
    	let h45;
    	let t83;
    	let p7;
    	let t84;
    	let b18;
    	let t86;
    	let br6;
    	let t87;
    	let br7;
    	let t88;
    	let b19;
    	let t90;
    	let pre5;
    	let b20;
    	let t92;
    	let b21;
    	let t94;
    	let t95;
    	let hr5;
    	let t96;
    	let h46;
    	let t98;
    	let p8;
    	let t99;
    	let b22;
    	let t101;
    	let br8;
    	let t102;
    	let br9;
    	let t103;
    	let t104;
    	let pre6;
    	let b23;
    	let t106;
    	let b24;
    	let t108;
    	let t109;
    	let hr6;
    	let t110;
    	let h47;
    	let t112;
    	let p9;
    	let t113;
    	let b25;
    	let t115;
    	let br10;
    	let t116;
    	let br11;
    	let t117;
    	let t118;
    	let pre7;
    	let b26;
    	let t120;
    	let b27;
    	let t122;
    	let t123;
    	let hr7;
    	let t124;
    	let h48;
    	let t126;
    	let p10;
    	let t127;
    	let b28;
    	let t129;
    	let br12;
    	let t130;
    	let br13;
    	let t131;
    	let br14;
    	let t132;
    	let br15;
    	let t133;
    	let t134;
    	let pre8;
    	let b29;
    	let t136;
    	let b30;
    	let t138;
    	let t139;
    	let hr8;
    	let t140;
    	let h49;
    	let t142;
    	let p11;
    	let t143;
    	let b31;
    	let t145;
    	let t146;
    	let pre9;
    	let b32;
    	let t148;
    	let b33;
    	let t150;
    	let t151;
    	let hr9;
    	let t152;
    	let h410;
    	let t154;
    	let p12;
    	let t155;
    	let b34;
    	let t157;
    	let b35;
    	let t159;
    	let b36;
    	let t161;
    	let b37;
    	let t163;
    	let t164;
    	let pre10;
    	let b38;
    	let t166;
    	let b39;
    	let t168;
    	let t169;
    	let hr10;
    	let t170;
    	let h411;
    	let t172;
    	let p13;
    	let t173;
    	let b40;
    	let t175;
    	let t176;
    	let ul1;
    	let li3;
    	let b41;
    	let t178;
    	let t179;
    	let li4;
    	let b42;
    	let t181;
    	let t182;
    	let li5;
    	let b43;
    	let t184;
    	let t185;
    	let li6;
    	let b44;
    	let t187;
    	let t188;
    	let pre11;
    	let b45;
    	let t190;
    	let b46;
    	let t192;
    	let t193;
    	let p14;
    	let t195;
    	let center;
    	let small;
    	let t197;
    	let pre12;
    	let t199;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			h40.textContent = "Configuration Options";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("The configuration are managed in a ");
    			a = element("a");
    			a.textContent = "Svelte Store.";
    			t4 = text("\n    The Svelte Store are one of the cooliest things in Svelte. Is very reactive and\n    helps us to make our router reactive too. You can change the behaviour at any\n    point and will instantly react to it.");
    			t5 = space();
    			h5 = element("h5");
    			h5.textContent = "Importing";
    			t7 = space();
    			pre0 = element("pre");
    			b0 = element("b");
    			b0.textContent = "// Importing configuration store";
    			t9 = text("\nimport { SCR_CONFIG_STORE } from \"svelte-client-router\"");
    			t10 = space();
    			p1 = element("p");
    			p1.textContent = "Next.. lets check out all the available properties.";
    			t12 = space();
    			hr0 = element("hr");
    			t13 = space();
    			h41 = element("h4");
    			h41.textContent = "Hash Mode";
    			t15 = space();
    			p2 = element("p");
    			t16 = text("The ");
    			b1 = element("b");
    			b1.textContent = "hashMode";
    			t18 = text(" option controls either if our router must check a hashed\n    based route like this site or must ");
    			b2 = element("b");
    			b2.textContent = "NOT";
    			t20 = text(" consider a hashed based route\n    path where the hash char doesn't mean much.\n    ");
    			br0 = element("br");
    			t21 = space();
    			br1 = element("br");
    			t22 = text("\n    This website for example must be hashed based because Github Pages is not prepared\n    to return the index.html page for each route request.");
    			t23 = space();
    			pre1 = element("pre");
    			b3 = element("b");
    			b3.textContent = "// ## Hash Mode checks route using #/ before the location path\n// ## for example http://localhost:5000/pathAAA#/pathBBB\n// ## it will consider only pathBBB and ignore pathAAA as path!\n// ## Boolean \n// ## Default value: false";
    			t25 = text("\n{\n  hashMode: false,\n}\n\n");
    			b4 = element("b");
    			b4.textContent = "// How to set in the store";
    			t27 = text("\nSCR_CONFIG_STORE.setHashMode(true);");
    			t28 = space();
    			hr1 = element("hr");
    			t29 = space();
    			h42 = element("h4");
    			h42.textContent = "Navigation History Limit";
    			t31 = space();
    			p3 = element("p");
    			t32 = text("The ");
    			b5 = element("b");
    			b5.textContent = "navigationHistoryLimit";
    			t34 = text(" option sets the size of the navigation\n    history. Inside the router store we have an array that contains all the\n    route objects where the first position is the last page visited and the last\n    position is the first page visited.\n    ");
    			br2 = element("br");
    			t35 = space();
    			br3 = element("br");
    			t36 = text("\n    If is set 0 or less it will be considered unlimited.");
    			t37 = space();
    			pre2 = element("pre");
    			b6 = element("b");
    			b6.textContent = "// ## Navigation History Limit is the amount of route history is added \n// ## in the route navigation history list \n// ## 0 or -1 equals to \"no limit\"\n// ## Integer\n// ## Default value: 10";
    			t39 = text("\n{\n  navigationHistoryLimit: 10, \n}\n\n");
    			b7 = element("b");
    			b7.textContent = "// How to set in the store";
    			t41 = text("\nSCR_CONFIG_STORE.setNavigationHistoryLimit(10);");
    			t42 = space();
    			hr2 = element("hr");
    			t43 = space();
    			h43 = element("h4");
    			h43.textContent = "Save Mode";
    			t45 = space();
    			p4 = element("p");
    			t46 = text("The ");
    			b8 = element("b");
    			b8.textContent = "saveMode";
    			t48 = text(" option has the following options:");
    			t49 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			b9 = element("b");
    			b9.textContent = "localstorage:";
    			t51 = text(" (default) Saves the router store in the localstorage.");
    			t52 = space();
    			li1 = element("li");
    			b10 = element("b");
    			b10.textContent = "indexeddb:";
    			t54 = text(" Saves the router store in the Index DB Storage.");
    			t55 = space();
    			li2 = element("li");
    			b11 = element("b");
    			b11.textContent = "none:";
    			t57 = text(" Doesn't save the store anywhere.");
    			t58 = space();
    			p5 = element("p");
    			p5.textContent = "The implications are implicit. Saving the route object helps us to keep\n    track all the user history if you need that information when reloading the\n    page.";
    			t60 = space();
    			pre3 = element("pre");
    			b12 = element("b");
    			b12.textContent = "// ## Save mode sets the type of saving history route and store\n// ## It can be set to one of this following values:\n// ## - localstorage: it saves route in the localstorage\n// ## - indexeddb: it saves route in the IndexedDb \n// ## - none: Doesn't save anything - meaning when reload it starts fresh all values!\n// ## String\n// ## Default value: localstorage";
    			t62 = text("\n{\n  saveMode: localstorage, \n}\n\n");
    			b13 = element("b");
    			b13.textContent = "// How to set in the store";
    			t64 = text("\nSCR_CONFIG_STORE.setSaveMode(\"localstorage\");");
    			t65 = space();
    			hr3 = element("hr");
    			t66 = space();
    			h44 = element("h4");
    			h44.textContent = "Not Found Route";
    			t68 = space();
    			p6 = element("p");
    			t69 = text("The ");
    			b14 = element("b");
    			b14.textContent = "notFoundRoute";
    			t71 = text(" option sets the route to redirect to when the user\n    enter a non existent url path.\n    ");
    			br4 = element("br");
    			t72 = space();
    			br5 = element("br");
    			t73 = space();
    			b15 = element("b");
    			b15.textContent = "OBS: It has to start with \"/\"";
    			t75 = space();
    			pre4 = element("pre");
    			b16 = element("b");
    			b16.textContent = "// ## Not Found Route Path\n// ## is the path that should redirect when not found a path in the application\n// ## String - must include \"/\"\n// ## Default value: /notFound";
    			t77 = text("\n{\n  notFound: \"/notFound\", \n}\n\n");
    			b17 = element("b");
    			b17.textContent = "// How to set in the store";
    			t79 = text("\nSCR_CONFIG_STORE.setNotFoundRoute(\"/notFound\");");
    			t80 = space();
    			hr4 = element("hr");
    			t81 = space();
    			h45 = element("h4");
    			h45.textContent = "Error Route";
    			t83 = space();
    			p7 = element("p");
    			t84 = text("The ");
    			b18 = element("b");
    			b18.textContent = "errorRoute";
    			t86 = text(" option sets the route to redirect to when an error\n    occurs.\n    ");
    			br6 = element("br");
    			t87 = space();
    			br7 = element("br");
    			t88 = space();
    			b19 = element("b");
    			b19.textContent = "OBS: It has to start with \"/\"";
    			t90 = space();
    			pre5 = element("pre");
    			b20 = element("b");
    			b20.textContent = "// ## Error Route Path\n// ## is the path that should redirect when an error occurs in the application\n// ## String - must include \"/\"\n// ## Default value: /error";
    			t92 = text("\n{\n  notFound: \"/error\", \n}\n\n");
    			b21 = element("b");
    			b21.textContent = "// How to set in the store";
    			t94 = text("\nSCR_CONFIG_STORE.setErrorRoute(\"/error\");");
    			t95 = space();
    			hr5 = element("hr");
    			t96 = space();
    			h46 = element("h4");
    			h46.textContent = "Console Log Error Messages";
    			t98 = space();
    			p8 = element("p");
    			t99 = text("The ");
    			b22 = element("b");
    			b22.textContent = "consoleLogErrorMessages";
    			t101 = text(" option enables SCR to log all possible\n    errors in the console log.\n    ");
    			br8 = element("br");
    			t102 = space();
    			br9 = element("br");
    			t103 = text("\n    When something goes wrong it helps to see the stack trace and the error messages.");
    			t104 = space();
    			pre6 = element("pre");
    			b23 = element("b");
    			b23.textContent = "// ## Console Log Error Messages logs in the console \n// ## any error messages of the SCR for debugging purposes\n// ## Boolean\n// ## Default value: true";
    			t106 = text("\n{\n  consoleLogStores: true, \n}\n\n");
    			b24 = element("b");
    			b24.textContent = "// How to set in the store";
    			t108 = text("\nSCR_CONFIG_STORE.setConsoleLogErrorMessages(true);");
    			t109 = space();
    			hr6 = element("hr");
    			t110 = space();
    			h47 = element("h4");
    			h47.textContent = "Console Log Stores";
    			t112 = space();
    			p9 = element("p");
    			t113 = text("The ");
    			b25 = element("b");
    			b25.textContent = "consoleLogStores";
    			t115 = text(" option enables SCR to log all changes in the\n    stores.\n    ");
    			br10 = element("br");
    			t116 = space();
    			br11 = element("br");
    			t117 = text("\n    This is great for debugging purposes.");
    			t118 = space();
    			pre7 = element("pre");
    			b26 = element("b");
    			b26.textContent = "// ## Console Log Stores logs in the console \n// ## any changes in the Router Store for debugging purposes\n// ## Boolean\n// ## Default value: true";
    			t120 = text("\n{\n  setConsoleLogStores: true, \n}\n\n");
    			b27 = element("b");
    			b27.textContent = "// How to set in the store";
    			t122 = text("\nSCR_CONFIG_STORE.setConsoleLogStores(true);");
    			t123 = space();
    			hr7 = element("hr");
    			t124 = space();
    			h48 = element("h4");
    			h48.textContent = "Uses Route Layout";
    			t126 = space();
    			p10 = element("p");
    			t127 = text("The ");
    			b28 = element("b");
    			b28.textContent = "usesRouteLayout";
    			t129 = text(" option tells the SCR that you are going to use a\n    Global Layout.\n    ");
    			br12 = element("br");
    			t130 = space();
    			br13 = element("br");
    			t131 = text("\n    You can set a layout per route, but most common cases you want to set a global\n    layout and if necessary set a different route layout.\n    ");
    			br14 = element("br");
    			t132 = space();
    			br15 = element("br");
    			t133 = text("\n    The SCR has a default simple layout that you probably not going to use, so if\n    you do not want to use a custom layout it is better to set this option to false.");
    			t134 = space();
    			pre8 = element("pre");
    			b29 = element("b");
    			b29.textContent = "// ## Uses Route Layout defines if you will be using layout \n// ## for each route or not - can be ignored in the route \n// ## Boolean\n// ## Default value: true";
    			t136 = text("\n{\n  usesRouteLayout: true, \n}\n\n");
    			b30 = element("b");
    			b30.textContent = "// How to set in the store";
    			t138 = text("\nSCR_CONFIG_STORE.setUsesRouteLayout(true);");
    			t139 = space();
    			hr8 = element("hr");
    			t140 = space();
    			h49 = element("h4");
    			h49.textContent = "Consider Trailing Slash On Matching Route";
    			t142 = space();
    			p11 = element("p");
    			t143 = text("The ");
    			b31 = element("b");
    			b31.textContent = "considerTrailingSlashOnMatchingRoute";
    			t145 = text(" option speaks for itself. When\n    searching for a matching route a trailing slash should be considered or not.");
    			t146 = space();
    			pre9 = element("pre");
    			b32 = element("b");
    			b32.textContent = "// ## Consider Trailing Slash On Matching Route\n// ## add an slash in the end of the route path to search in the route definitions\n// ## Boolean\n// ## Default value: true";
    			t148 = text("\n{\nconsiderTrailingSlashOnMatchingRoute: true, \n}\n\n");
    			b33 = element("b");
    			b33.textContent = "// How to set in the store";
    			t150 = text("\nSCR_CONFIG_STORE.setConsiderTrailingSlashOnMatchingRoute(true);");
    			t151 = space();
    			hr9 = element("hr");
    			t152 = space();
    			h410 = element("h4");
    			h410.textContent = "Use Scroll";
    			t154 = space();
    			p12 = element("p");
    			t155 = text("The ");
    			b34 = element("b");
    			b34.textContent = "useScroll";
    			t157 = text(" option tell SCR that you will be using a scroll\n    behaviour globally. That means SCR will apply the global ");
    			b35 = element("b");
    			b35.textContent = "scrollProps";
    			t159 = text("\n    configuration for each route entered if the route do not specify a differente\n    ");
    			b36 = element("b");
    			b36.textContent = "scrollProps";
    			t161 = text("\n    configuration or the ");
    			b37 = element("b");
    			b37.textContent = "ignoreScroll";
    			t163 = text(" property.");
    			t164 = space();
    			pre10 = element("pre");
    			b38 = element("b");
    			b38.textContent = "// ## Use Scroll - enable or disables scrolling on entering the route\n// ## Boolean\n// ## Default value: true";
    			t166 = text("\n{\nuseScroll: true, \n}\n\n");
    			b39 = element("b");
    			b39.textContent = "// How to set in the store";
    			t168 = text("\nSCR_CONFIG_STORE.setUseScroll(true);");
    			t169 = space();
    			hr10 = element("hr");
    			t170 = space();
    			h411 = element("h4");
    			h411.textContent = "Scroll Props";
    			t172 = space();
    			p13 = element("p");
    			t173 = text("The ");
    			b40 = element("b");
    			b40.textContent = "scrollProps";
    			t175 = text(" option is the behaviour options when the scrolling is enabled.\n    It has the following options:");
    			t176 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			b41 = element("b");
    			b41.textContent = "top: ";
    			t178 = text("The top position to scroll - Default is 0");
    			t179 = space();
    			li4 = element("li");
    			b42 = element("b");
    			b42.textContent = "left: ";
    			t181 = text("The left position to scroll - Default is 0");
    			t182 = space();
    			li5 = element("li");
    			b43 = element("b");
    			b43.textContent = "behaviour: ";
    			t184 = text("The behaviour when scrolling to position - Default is\n      \"smooth\"");
    			t185 = space();
    			li6 = element("li");
    			b44 = element("b");
    			b44.textContent = "timeout: ";
    			t187 = text("This options sets a timeout to fire the scrolling. The\n      minimum value accepted is 10 milliseconds. Default is 10 milliseconds.");
    			t188 = space();
    			pre11 = element("pre");
    			b45 = element("b");
    			b45.textContent = "// ## Scroll Props\n// ## The scrolling props on entering the route if enabled\n// ## Default Values: \n// ## scrollProps: {\n// ##   top: 0,\n// ##   left: 0,\n// ##   behaviour: \"smooth\",\n// ##   timeout: 10, // timeout must be greater than 10 milliseconds\n// ## },\n// ## Object\n// ## Default value: {\n  top: 0,\n  left: 0,\n  behaviour: \"smooth\",   \n  timeout: 10, // timeout must be greater than 10 milliseconds\n}";
    			t190 = text("\n{\nscrollProps: {\n  top: 0,\n  left: 0,\n  behaviour: \"smooth\",\n  timeout: 10, // timeout must be greater than 10 milliseconds\n}, \n\n");
    			b46 = element("b");
    			b46.textContent = "// How to set in the store";
    			t192 = text("\nSCR_CONFIG_STORE.setScrollProps({\n  top: 0,\n  left: 0,\n  behaviour: \"smooth\",\n  timeout: 10,\n});");
    			t193 = space();
    			p14 = element("p");
    			p14.textContent = "So that is it for this section. But the configuration store is not over yet.\n    The next properties has its own sections each. Click next to see more\n    information.";
    			t195 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t197 = space();
    			pre12 = element("pre");
    			pre12.textContent = "{\n    name: \"configurationOptionsRoute\",\n    path: \"/svelte-client-router/configurationOptions\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_ConfigurationOptions.svelte\"),\n    title: \"SCR - Configuration Options\",\n}";
    			t199 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$f, 6, 2, 180);
    			attr_dev(a, "href", "https://svelte.dev/tutorial/writable-stores");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$f, 8, 39, 271);
    			add_location(p0, file$f, 7, 2, 228);
    			add_location(h5, file$f, 16, 2, 593);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$f, 19, 0, 640);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$f, 17, 2, 614);
    			add_location(p1, file$f, 22, 2, 771);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$f, 24, 2, 922);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$f, 25, 2, 946);
    			add_location(b1, file$f, 27, 8, 1019);
    			add_location(b2, file$f, 28, 39, 1131);
    			add_location(br0, file$f, 30, 4, 1224);
    			add_location(br1, file$f, 31, 4, 1235);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$f, 26, 2, 982);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$f, 37, 0, 1422);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$f, 48, 0, 1705);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$f, 35, 2, 1396);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$f, 53, 2, 1982);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$f, 54, 2, 2006);
    			add_location(b5, file$f, 56, 8, 2094);
    			add_location(br2, file$f, 60, 4, 2364);
    			add_location(br3, file$f, 61, 4, 2375);
    			attr_dev(p3, "class", "scr-text-justify");
    			add_location(p3, file$f, 55, 2, 2057);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$f, 66, 0, 2474);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$f, 77, 0, 2732);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$f, 64, 2, 2448);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$f, 82, 2, 3021);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$f, 83, 2, 3045);
    			add_location(b8, file$f, 85, 8, 3118);
    			attr_dev(p4, "class", "scr-text-justify");
    			add_location(p4, file$f, 84, 2, 3081);
    			add_location(b9, file$f, 89, 6, 3197);
    			add_location(li0, file$f, 88, 4, 3186);
    			add_location(b10, file$f, 91, 8, 3290);
    			add_location(li1, file$f, 91, 4, 3286);
    			add_location(b11, file$f, 92, 8, 3369);
    			add_location(li2, file$f, 92, 4, 3365);
    			add_location(ul0, file$f, 87, 2, 3177);
    			add_location(p5, file$f, 94, 2, 3430);
    			attr_dev(b12, "class", "scr-b");
    			add_location(b12, file$f, 101, 0, 3634);
    			attr_dev(b13, "class", "scr-b");
    			add_location(b13, file$f, 114, 0, 4058);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$f, 99, 2, 3608);
    			attr_dev(hr3, "class", "scr-hr");
    			add_location(hr3, file$f, 119, 2, 4345);
    			attr_dev(h44, "class", "scr-h4");
    			add_location(h44, file$f, 120, 2, 4369);
    			add_location(b14, file$f, 122, 8, 4448);
    			add_location(br4, file$f, 124, 4, 4559);
    			add_location(br5, file$f, 125, 4, 4570);
    			add_location(b15, file$f, 126, 4, 4581);
    			attr_dev(p6, "class", "scr-text-justify");
    			add_location(p6, file$f, 121, 2, 4411);
    			attr_dev(b16, "class", "scr-b");
    			add_location(b16, file$f, 130, 0, 4654);
    			attr_dev(b17, "class", "scr-b");
    			add_location(b17, file$f, 140, 0, 4888);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$f, 128, 2, 4628);
    			attr_dev(hr4, "class", "scr-hr");
    			add_location(hr4, file$f, 145, 2, 5177);
    			attr_dev(h45, "class", "scr-h4");
    			add_location(h45, file$f, 146, 2, 5201);
    			add_location(b18, file$f, 148, 8, 5276);
    			add_location(br6, file$f, 150, 4, 5361);
    			add_location(br7, file$f, 151, 4, 5372);
    			add_location(b19, file$f, 152, 4, 5383);
    			attr_dev(p7, "class", "scr-text-justify");
    			add_location(p7, file$f, 147, 2, 5239);
    			attr_dev(b20, "class", "scr-b");
    			add_location(b20, file$f, 156, 0, 5456);
    			attr_dev(b21, "class", "scr-b");
    			add_location(b21, file$f, 166, 0, 5679);
    			attr_dev(pre5, "class", "scr-pre");
    			add_location(pre5, file$f, 154, 2, 5430);
    			attr_dev(hr5, "class", "scr-hr");
    			add_location(hr5, file$f, 171, 2, 5962);
    			attr_dev(h46, "class", "scr-h4");
    			add_location(h46, file$f, 172, 2, 5986);
    			add_location(b22, file$f, 174, 8, 6076);
    			add_location(br8, file$f, 176, 4, 6181);
    			add_location(br9, file$f, 177, 4, 6192);
    			attr_dev(p8, "class", "scr-text-justify");
    			add_location(p8, file$f, 173, 2, 6039);
    			attr_dev(b23, "class", "scr-b");
    			add_location(b23, file$f, 182, 0, 6320);
    			attr_dev(b24, "class", "scr-b");
    			add_location(b24, file$f, 192, 0, 6538);
    			attr_dev(pre6, "class", "scr-pre");
    			add_location(pre6, file$f, 180, 2, 6294);
    			attr_dev(hr6, "class", "scr-hr");
    			add_location(hr6, file$f, 197, 2, 6828);
    			attr_dev(h47, "class", "scr-h4");
    			add_location(h47, file$f, 198, 2, 6852);
    			add_location(b25, file$f, 200, 8, 6934);
    			add_location(br10, file$f, 202, 4, 7019);
    			add_location(br11, file$f, 203, 4, 7030);
    			attr_dev(p9, "class", "scr-text-justify");
    			add_location(p9, file$f, 199, 2, 6897);
    			attr_dev(b26, "class", "scr-b");
    			add_location(b26, file$f, 208, 0, 7114);
    			attr_dev(b27, "class", "scr-b");
    			add_location(b27, file$f, 218, 0, 7329);
    			attr_dev(pre7, "class", "scr-pre");
    			add_location(pre7, file$f, 206, 2, 7088);
    			attr_dev(hr7, "class", "scr-hr");
    			add_location(hr7, file$f, 223, 2, 7614);
    			attr_dev(h48, "class", "scr-h4");
    			add_location(h48, file$f, 224, 2, 7638);
    			add_location(b28, file$f, 226, 8, 7719);
    			add_location(br12, file$f, 228, 4, 7814);
    			add_location(br13, file$f, 229, 4, 7825);
    			add_location(br14, file$f, 232, 4, 7977);
    			add_location(br15, file$f, 233, 4, 7988);
    			attr_dev(p10, "class", "scr-text-justify");
    			add_location(p10, file$f, 225, 2, 7682);
    			attr_dev(b29, "class", "scr-b");
    			add_location(b29, file$f, 239, 0, 8197);
    			attr_dev(b30, "class", "scr-b");
    			add_location(b30, file$f, 249, 0, 8421);
    			attr_dev(pre8, "class", "scr-pre");
    			add_location(pre8, file$f, 237, 2, 8171);
    			attr_dev(hr8, "class", "scr-hr");
    			add_location(hr8, file$f, 254, 2, 8705);
    			attr_dev(h49, "class", "scr-h4");
    			add_location(h49, file$f, 255, 2, 8729);
    			add_location(b31, file$f, 257, 8, 8834);
    			attr_dev(p11, "class", "scr-text-justify");
    			add_location(p11, file$f, 256, 2, 8797);
    			attr_dev(b32, "class", "scr-b");
    			add_location(b32, file$f, 262, 0, 9025);
    			attr_dev(b33, "class", "scr-b");
    			add_location(b33, file$f, 272, 0, 9279);
    			attr_dev(pre9, "class", "scr-pre");
    			add_location(pre9, file$f, 260, 2, 8999);
    			attr_dev(hr9, "class", "scr-hr");
    			add_location(hr9, file$f, 277, 2, 9584);
    			attr_dev(h410, "class", "scr-h4");
    			add_location(h410, file$f, 278, 2, 9608);
    			add_location(b34, file$f, 280, 8, 9682);
    			add_location(b35, file$f, 281, 61, 9808);
    			add_location(b36, file$f, 283, 4, 9913);
    			add_location(b37, file$f, 284, 25, 9957);
    			attr_dev(p12, "class", "scr-text-justify");
    			add_location(p12, file$f, 279, 2, 9645);
    			attr_dev(b38, "class", "scr-b");
    			add_location(b38, file$f, 288, 0, 10022);
    			attr_dev(b39, "class", "scr-b");
    			add_location(b39, file$f, 297, 0, 10188);
    			attr_dev(pre10, "class", "scr-pre");
    			add_location(pre10, file$f, 286, 2, 9996);
    			attr_dev(hr10, "class", "scr-hr");
    			add_location(hr10, file$f, 302, 2, 10466);
    			attr_dev(h411, "class", "scr-h4");
    			add_location(h411, file$f, 303, 2, 10490);
    			add_location(b40, file$f, 305, 8, 10566);
    			attr_dev(p13, "class", "scr-text-justify");
    			add_location(p13, file$f, 304, 2, 10529);
    			add_location(b41, file$f, 309, 8, 10704);
    			add_location(li3, file$f, 309, 4, 10700);
    			add_location(b42, file$f, 310, 8, 10771);
    			add_location(li4, file$f, 310, 4, 10767);
    			add_location(b43, file$f, 312, 6, 10847);
    			add_location(li5, file$f, 311, 4, 10836);
    			add_location(b44, file$f, 316, 6, 10959);
    			add_location(li6, file$f, 315, 4, 10948);
    			add_location(ul1, file$f, 308, 2, 10691);
    			attr_dev(b45, "class", "scr-b");
    			add_location(b45, file$f, 322, 0, 11153);
    			attr_dev(b46, "class", "scr-b");
    			add_location(b46, file$f, 348, 0, 11750);
    			attr_dev(pre11, "class", "scr-pre");
    			add_location(pre11, file$f, 320, 2, 11127);
    			attr_dev(p14, "class", "scr-text-justify");
    			add_location(p14, file$f, 356, 2, 11913);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$f, 363, 4, 12156);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$f, 362, 2, 12124);
    			attr_dev(pre12, "class", "scr-pre");
    			add_location(pre12, file$f, 365, 2, 12237);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$f, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, a);
    			append_dev(p0, t4);
    			append_dev(div, t5);
    			append_dev(div, h5);
    			append_dev(div, t7);
    			append_dev(div, pre0);
    			append_dev(pre0, b0);
    			append_dev(pre0, t9);
    			append_dev(div, t10);
    			append_dev(div, p1);
    			append_dev(div, t12);
    			append_dev(div, hr0);
    			append_dev(div, t13);
    			append_dev(div, h41);
    			append_dev(div, t15);
    			append_dev(div, p2);
    			append_dev(p2, t16);
    			append_dev(p2, b1);
    			append_dev(p2, t18);
    			append_dev(p2, b2);
    			append_dev(p2, t20);
    			append_dev(p2, br0);
    			append_dev(p2, t21);
    			append_dev(p2, br1);
    			append_dev(p2, t22);
    			append_dev(div, t23);
    			append_dev(div, pre1);
    			append_dev(pre1, b3);
    			append_dev(pre1, t25);
    			append_dev(pre1, b4);
    			append_dev(pre1, t27);
    			append_dev(div, t28);
    			append_dev(div, hr1);
    			append_dev(div, t29);
    			append_dev(div, h42);
    			append_dev(div, t31);
    			append_dev(div, p3);
    			append_dev(p3, t32);
    			append_dev(p3, b5);
    			append_dev(p3, t34);
    			append_dev(p3, br2);
    			append_dev(p3, t35);
    			append_dev(p3, br3);
    			append_dev(p3, t36);
    			append_dev(div, t37);
    			append_dev(div, pre2);
    			append_dev(pre2, b6);
    			append_dev(pre2, t39);
    			append_dev(pre2, b7);
    			append_dev(pre2, t41);
    			append_dev(div, t42);
    			append_dev(div, hr2);
    			append_dev(div, t43);
    			append_dev(div, h43);
    			append_dev(div, t45);
    			append_dev(div, p4);
    			append_dev(p4, t46);
    			append_dev(p4, b8);
    			append_dev(p4, t48);
    			append_dev(div, t49);
    			append_dev(div, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, b9);
    			append_dev(li0, t51);
    			append_dev(ul0, t52);
    			append_dev(ul0, li1);
    			append_dev(li1, b10);
    			append_dev(li1, t54);
    			append_dev(ul0, t55);
    			append_dev(ul0, li2);
    			append_dev(li2, b11);
    			append_dev(li2, t57);
    			append_dev(div, t58);
    			append_dev(div, p5);
    			append_dev(div, t60);
    			append_dev(div, pre3);
    			append_dev(pre3, b12);
    			append_dev(pre3, t62);
    			append_dev(pre3, b13);
    			append_dev(pre3, t64);
    			append_dev(div, t65);
    			append_dev(div, hr3);
    			append_dev(div, t66);
    			append_dev(div, h44);
    			append_dev(div, t68);
    			append_dev(div, p6);
    			append_dev(p6, t69);
    			append_dev(p6, b14);
    			append_dev(p6, t71);
    			append_dev(p6, br4);
    			append_dev(p6, t72);
    			append_dev(p6, br5);
    			append_dev(p6, t73);
    			append_dev(p6, b15);
    			append_dev(div, t75);
    			append_dev(div, pre4);
    			append_dev(pre4, b16);
    			append_dev(pre4, t77);
    			append_dev(pre4, b17);
    			append_dev(pre4, t79);
    			append_dev(div, t80);
    			append_dev(div, hr4);
    			append_dev(div, t81);
    			append_dev(div, h45);
    			append_dev(div, t83);
    			append_dev(div, p7);
    			append_dev(p7, t84);
    			append_dev(p7, b18);
    			append_dev(p7, t86);
    			append_dev(p7, br6);
    			append_dev(p7, t87);
    			append_dev(p7, br7);
    			append_dev(p7, t88);
    			append_dev(p7, b19);
    			append_dev(div, t90);
    			append_dev(div, pre5);
    			append_dev(pre5, b20);
    			append_dev(pre5, t92);
    			append_dev(pre5, b21);
    			append_dev(pre5, t94);
    			append_dev(div, t95);
    			append_dev(div, hr5);
    			append_dev(div, t96);
    			append_dev(div, h46);
    			append_dev(div, t98);
    			append_dev(div, p8);
    			append_dev(p8, t99);
    			append_dev(p8, b22);
    			append_dev(p8, t101);
    			append_dev(p8, br8);
    			append_dev(p8, t102);
    			append_dev(p8, br9);
    			append_dev(p8, t103);
    			append_dev(div, t104);
    			append_dev(div, pre6);
    			append_dev(pre6, b23);
    			append_dev(pre6, t106);
    			append_dev(pre6, b24);
    			append_dev(pre6, t108);
    			append_dev(div, t109);
    			append_dev(div, hr6);
    			append_dev(div, t110);
    			append_dev(div, h47);
    			append_dev(div, t112);
    			append_dev(div, p9);
    			append_dev(p9, t113);
    			append_dev(p9, b25);
    			append_dev(p9, t115);
    			append_dev(p9, br10);
    			append_dev(p9, t116);
    			append_dev(p9, br11);
    			append_dev(p9, t117);
    			append_dev(div, t118);
    			append_dev(div, pre7);
    			append_dev(pre7, b26);
    			append_dev(pre7, t120);
    			append_dev(pre7, b27);
    			append_dev(pre7, t122);
    			append_dev(div, t123);
    			append_dev(div, hr7);
    			append_dev(div, t124);
    			append_dev(div, h48);
    			append_dev(div, t126);
    			append_dev(div, p10);
    			append_dev(p10, t127);
    			append_dev(p10, b28);
    			append_dev(p10, t129);
    			append_dev(p10, br12);
    			append_dev(p10, t130);
    			append_dev(p10, br13);
    			append_dev(p10, t131);
    			append_dev(p10, br14);
    			append_dev(p10, t132);
    			append_dev(p10, br15);
    			append_dev(p10, t133);
    			append_dev(div, t134);
    			append_dev(div, pre8);
    			append_dev(pre8, b29);
    			append_dev(pre8, t136);
    			append_dev(pre8, b30);
    			append_dev(pre8, t138);
    			append_dev(div, t139);
    			append_dev(div, hr8);
    			append_dev(div, t140);
    			append_dev(div, h49);
    			append_dev(div, t142);
    			append_dev(div, p11);
    			append_dev(p11, t143);
    			append_dev(p11, b31);
    			append_dev(p11, t145);
    			append_dev(div, t146);
    			append_dev(div, pre9);
    			append_dev(pre9, b32);
    			append_dev(pre9, t148);
    			append_dev(pre9, b33);
    			append_dev(pre9, t150);
    			append_dev(div, t151);
    			append_dev(div, hr9);
    			append_dev(div, t152);
    			append_dev(div, h410);
    			append_dev(div, t154);
    			append_dev(div, p12);
    			append_dev(p12, t155);
    			append_dev(p12, b34);
    			append_dev(p12, t157);
    			append_dev(p12, b35);
    			append_dev(p12, t159);
    			append_dev(p12, b36);
    			append_dev(p12, t161);
    			append_dev(p12, b37);
    			append_dev(p12, t163);
    			append_dev(div, t164);
    			append_dev(div, pre10);
    			append_dev(pre10, b38);
    			append_dev(pre10, t166);
    			append_dev(pre10, b39);
    			append_dev(pre10, t168);
    			append_dev(div, t169);
    			append_dev(div, hr10);
    			append_dev(div, t170);
    			append_dev(div, h411);
    			append_dev(div, t172);
    			append_dev(div, p13);
    			append_dev(p13, t173);
    			append_dev(p13, b40);
    			append_dev(p13, t175);
    			append_dev(div, t176);
    			append_dev(div, ul1);
    			append_dev(ul1, li3);
    			append_dev(li3, b41);
    			append_dev(li3, t178);
    			append_dev(ul1, t179);
    			append_dev(ul1, li4);
    			append_dev(li4, b42);
    			append_dev(li4, t181);
    			append_dev(ul1, t182);
    			append_dev(ul1, li5);
    			append_dev(li5, b43);
    			append_dev(li5, t184);
    			append_dev(ul1, t185);
    			append_dev(ul1, li6);
    			append_dev(li6, b44);
    			append_dev(li6, t187);
    			append_dev(div, t188);
    			append_dev(div, pre11);
    			append_dev(pre11, b45);
    			append_dev(pre11, t190);
    			append_dev(pre11, b46);
    			append_dev(pre11, t192);
    			append_dev(div, t193);
    			append_dev(div, p14);
    			append_dev(div, t195);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t197);
    			append_dev(div, pre12);
    			append_dev(div, t199);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_ConfigurationOptions", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_ConfigurationOptions> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_ConfigurationOptions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_ConfigurationOptions",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    var SCR_ConfigurationOptions$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_ConfigurationOptions
    });

    /* src/docs/components/SCR_BeforeEnterRouteAnatomy.svelte generated by Svelte v3.37.0 */

    const file$e = "src/docs/components/SCR_BeforeEnterRouteAnatomy.svelte";

    function create_fragment$e(ctx) {
    	let h4;
    	let t1;
    	let p0;
    	let t3;
    	let pre;
    	let b0;
    	let t5;
    	let t6;
    	let ul3;
    	let li5;
    	let b1;
    	let t8;
    	let br0;
    	let t9;
    	let ul0;
    	let li0;
    	let b2;
    	let t11;
    	let t12;
    	let li1;
    	let b3;
    	let t14;
    	let t15;
    	let li2;
    	let b4;
    	let t17;
    	let br1;
    	let t18;
    	let br2;
    	let t19;
    	let br3;
    	let t20;
    	let li3;
    	let b5;
    	let t22;
    	let br4;
    	let t23;
    	let br5;
    	let t24;
    	let br6;
    	let t25;
    	let li4;
    	let b6;
    	let t27;
    	let br7;
    	let t28;
    	let br8;
    	let t29;
    	let br9;
    	let t30;
    	let li14;
    	let b7;
    	let t32;
    	let ul1;
    	let li6;
    	let b8;
    	let t34;
    	let t35;
    	let li7;
    	let b9;
    	let t37;
    	let t38;
    	let li8;
    	let b10;
    	let t40;
    	let t41;
    	let li9;
    	let b11;
    	let t43;
    	let t44;
    	let li10;
    	let b12;
    	let t46;
    	let t47;
    	let li11;
    	let b13;
    	let t49;
    	let t50;
    	let li12;
    	let b14;
    	let t52;
    	let t53;
    	let li13;
    	let b15;
    	let t55;
    	let t56;
    	let br10;
    	let t57;
    	let li23;
    	let b16;
    	let t59;
    	let ul2;
    	let li15;
    	let b17;
    	let t61;
    	let t62;
    	let li16;
    	let b18;
    	let t64;
    	let t65;
    	let li17;
    	let b19;
    	let t67;
    	let t68;
    	let li18;
    	let b20;
    	let t70;
    	let t71;
    	let li19;
    	let b21;
    	let t73;
    	let t74;
    	let li20;
    	let b22;
    	let t76;
    	let t77;
    	let li21;
    	let b23;
    	let t79;
    	let t80;
    	let li22;
    	let b24;
    	let t82;
    	let t83;
    	let br11;
    	let t84;
    	let li24;
    	let b25;
    	let t86;
    	let t87;
    	let br12;
    	let t88;
    	let li25;
    	let b26;
    	let t90;
    	let br13;
    	let t91;
    	let span;
    	let b27;
    	let t93;
    	let t94;
    	let p1;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Anatomy of the Before Enter Function";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "When declaring a Before Enter function it will be provided some cool\n  parameters for you to play with. Lets check them in order of declaration:";
    			t3 = space();
    			pre = element("pre");
    			b0 = element("b");
    			b0.textContent = "// Example of one before enter function declaration";
    			t5 = text("\n(resolve, routeFrom, routeTo, routeObjParams, payload) => { \n  resolve(true); \n}");
    			t6 = space();
    			ul3 = element("ul");
    			li5 = element("li");
    			b1 = element("b");
    			b1.textContent = "resolve: ";
    			t8 = text("The first param is the a solvable function. When all the\n    code has executed you must call this function to end it. Note that there\n    isn't a reject call as one might expect.\n    ");
    			br0 = element("br");
    			t9 = text("\n    You always solve the Before Function with resolve! The resolve function can receive\n    the following parameters:\n    ");
    			ul0 = element("ul");
    			li0 = element("li");
    			b2 = element("b");
    			b2.textContent = "true:";
    			t11 = text(" When is everything ok and should continue execution. For example:\n        resolve(true)");
    			t12 = space();
    			li1 = element("li");
    			b3 = element("b");
    			b3.textContent = "false:";
    			t14 = text(" When something went wrong and should stop execution. For example:\n        resolve(false) or resolve()");
    			t15 = space();
    			li2 = element("li");
    			b4 = element("b");
    			b4.textContent = "{ redirect: \"/somePath\" }:";
    			t17 = text(" To redirect to another\n        route. This means that it will not continue executing the Before Enter\n        sequence and just will redirect to the specified path.\n        ");
    			br1 = element("br");
    			t18 = text("\n        For example: resolve({ redirect: \"/somePath\" })\n        ");
    			br2 = element("br");
    			t19 = space();
    			br3 = element("br");
    			t20 = space();
    			li3 = element("li");
    			b5 = element("b");
    			b5.textContent = "{ path: \"/somePath\" }:";
    			t22 = text(" To redirect to another route.\n        This means that it will not continue executing the Before Enter sequence\n        and just will redirect to the specified path.\n        ");
    			br4 = element("br");
    			t23 = text("\n        For example: resolve({ path: \"/somePath\" })\n        ");
    			br5 = element("br");
    			t24 = space();
    			br6 = element("br");
    			t25 = space();
    			li4 = element("li");
    			b6 = element("b");
    			b6.textContent = "{ name: \"routeName\" }:";
    			t27 = text(" To redirect to another route by\n        name. This means that it will not continue executing the Before Enter\n        sequence and just will redirect to the specified route name.\n        ");
    			br7 = element("br");
    			t28 = text("\n        For example: resolve({ name: \"someRouteName\" })\n        ");
    			br8 = element("br");
    			t29 = space();
    			br9 = element("br");
    			t30 = space();
    			li14 = element("li");
    			b7 = element("b");
    			b7.textContent = "routeFrom: ";
    			t32 = text("This is an object containing the values of the route which\n    is coming from. This object has the following values:\n    ");
    			ul1 = element("ul");
    			li6 = element("li");
    			b8 = element("b");
    			b8.textContent = "name: ";
    			t34 = text("The name of the route");
    			t35 = space();
    			li7 = element("li");
    			b9 = element("b");
    			b9.textContent = "hash: ";
    			t37 = text("The hash value of the route");
    			t38 = space();
    			li8 = element("li");
    			b10 = element("b");
    			b10.textContent = "hostname: ";
    			t40 = text("The hostname of the route. For example: \"localhost\"");
    			t41 = space();
    			li9 = element("li");
    			b11 = element("b");
    			b11.textContent = "origin: ";
    			t43 = text("The origin of the route. For example:\n        \"http://localhost:5000\"");
    			t44 = space();
    			li10 = element("li");
    			b12 = element("b");
    			b12.textContent = "params: ";
    			t46 = text("The query params of the route. For example: {\n        testParam: \"someParamValue\" }");
    			t47 = space();
    			li11 = element("li");
    			b13 = element("b");
    			b13.textContent = "pathname: ";
    			t49 = text("The path of the route. For example:\n        \"/svelte-client-router/configurationBeforeEnter\"");
    			t50 = space();
    			li12 = element("li");
    			b14 = element("b");
    			b14.textContent = "port: ";
    			t52 = text("The port of the host. For example: \"5000\"");
    			t53 = space();
    			li13 = element("li");
    			b15 = element("b");
    			b15.textContent = "protocol: ";
    			t55 = text("The protocol used. For example: \"http:\"");
    			t56 = space();
    			br10 = element("br");
    			t57 = space();
    			li23 = element("li");
    			b16 = element("b");
    			b16.textContent = "routeTo: ";
    			t59 = text("This is an object containing the values of the route which\n    is going to. This object has the following values:\n    ");
    			ul2 = element("ul");
    			li15 = element("li");
    			b17 = element("b");
    			b17.textContent = "name: ";
    			t61 = text("The name of the route");
    			t62 = space();
    			li16 = element("li");
    			b18 = element("b");
    			b18.textContent = "hash: ";
    			t64 = text("The hash value of the route");
    			t65 = space();
    			li17 = element("li");
    			b19 = element("b");
    			b19.textContent = "hostname: ";
    			t67 = text("The hostname of the route. For example: \"localhost\"");
    			t68 = space();
    			li18 = element("li");
    			b20 = element("b");
    			b20.textContent = "origin: ";
    			t70 = text("The origin of the route. For example:\n        \"http://localhost:5000\"");
    			t71 = space();
    			li19 = element("li");
    			b21 = element("b");
    			b21.textContent = "params: ";
    			t73 = text("The query params of the route. For example: {\n        testParam: \"someParamValue\" }");
    			t74 = space();
    			li20 = element("li");
    			b22 = element("b");
    			b22.textContent = "pathname: ";
    			t76 = text("The path of the route. For example:\n        \"/svelte-client-router/configurationBeforeEnter\"");
    			t77 = space();
    			li21 = element("li");
    			b23 = element("b");
    			b23.textContent = "port: ";
    			t79 = text("The port of the host. For example: \"5000\"");
    			t80 = space();
    			li22 = element("li");
    			b24 = element("b");
    			b24.textContent = "protocol: ";
    			t82 = text("The protocol used. For example: \"http:\"");
    			t83 = space();
    			br11 = element("br");
    			t84 = space();
    			li24 = element("li");
    			b25 = element("b");
    			b25.textContent = "routeObjectParam: ";
    			t86 = text("All the parameters passed to this route set in the\n    route object definition until the execution of this before enter. Order of declaration matters.\n    It will include any defined payload properties.");
    			t87 = space();
    			br12 = element("br");
    			t88 = space();
    			li25 = element("li");
    			b26 = element("b");
    			b26.textContent = "payload: ";
    			t90 = text("This is an special object. You can set parameters to pass\n    forward down the chain of before enter funcions execution. This variable\n    will be made available in all the component and layout components.\n    ");
    			br13 = element("br");
    			t91 = space();
    			span = element("span");
    			b27 = element("b");
    			b27.textContent = "OBS:";
    			t93 = text(" DO NOT REDEFINE THIS OBJECT - because you will lose all previous\n      properties set and it will reset the object not sending the new definition\n      that you made for this object.");
    			t94 = space();
    			p1 = element("p");
    			p1.textContent = "So that is it for this section. This is a powerfull feature enables us to\n  control for each route necessary security of overall behaviour.";
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$e, 0, 0, 0);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$e, 1, 0, 61);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$e, 7, 0, 266);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file$e, 5, 0, 242);
    			add_location(b1, file$e, 14, 4, 458);
    			add_location(br0, file$e, 17, 4, 657);
    			add_location(b2, file$e, 22, 8, 810);
    			add_location(li0, file$e, 21, 6, 797);
    			add_location(b3, file$e, 26, 8, 943);
    			add_location(li1, file$e, 25, 6, 930);
    			add_location(b4, file$e, 30, 8, 1091);
    			add_location(br1, file$e, 33, 8, 1308);
    			add_location(br2, file$e, 35, 8, 1388);
    			add_location(br3, file$e, 36, 8, 1403);
    			add_location(li2, file$e, 29, 6, 1078);
    			add_location(b5, file$e, 39, 8, 1441);
    			add_location(br4, file$e, 42, 8, 1654);
    			add_location(br5, file$e, 44, 8, 1730);
    			add_location(br6, file$e, 45, 8, 1745);
    			add_location(li3, file$e, 38, 6, 1428);
    			add_location(b6, file$e, 48, 8, 1783);
    			add_location(br7, file$e, 51, 8, 2010);
    			add_location(br8, file$e, 53, 8, 2090);
    			add_location(br9, file$e, 54, 8, 2105);
    			add_location(li4, file$e, 47, 6, 1770);
    			add_location(ul0, file$e, 20, 4, 786);
    			add_location(li5, file$e, 13, 2, 449);
    			add_location(b7, file$e, 59, 4, 2153);
    			add_location(b8, file$e, 62, 10, 2307);
    			add_location(li6, file$e, 62, 6, 2303);
    			add_location(b9, file$e, 63, 10, 2357);
    			add_location(li7, file$e, 63, 6, 2353);
    			add_location(b10, file$e, 65, 8, 2422);
    			add_location(li8, file$e, 64, 6, 2409);
    			add_location(b11, file$e, 68, 8, 2522);
    			add_location(li9, file$e, 67, 6, 2509);
    			add_location(b12, file$e, 72, 8, 2638);
    			add_location(li10, file$e, 71, 6, 2625);
    			add_location(b13, file$e, 76, 8, 2777);
    			add_location(li11, file$e, 75, 6, 2764);
    			add_location(b14, file$e, 79, 10, 2909);
    			add_location(li12, file$e, 79, 6, 2905);
    			add_location(b15, file$e, 80, 10, 2979);
    			add_location(li13, file$e, 80, 6, 2975);
    			add_location(ul1, file$e, 61, 4, 2292);
    			add_location(li14, file$e, 58, 2, 2144);
    			add_location(br10, file$e, 83, 2, 3061);
    			add_location(b16, file$e, 85, 4, 3079);
    			add_location(b17, file$e, 88, 10, 3228);
    			add_location(li15, file$e, 88, 6, 3224);
    			add_location(b18, file$e, 89, 10, 3278);
    			add_location(li16, file$e, 89, 6, 3274);
    			add_location(b19, file$e, 91, 8, 3343);
    			add_location(li17, file$e, 90, 6, 3330);
    			add_location(b20, file$e, 94, 8, 3443);
    			add_location(li18, file$e, 93, 6, 3430);
    			add_location(b21, file$e, 98, 8, 3559);
    			add_location(li19, file$e, 97, 6, 3546);
    			add_location(b22, file$e, 102, 8, 3698);
    			add_location(li20, file$e, 101, 6, 3685);
    			add_location(b23, file$e, 105, 10, 3830);
    			add_location(li21, file$e, 105, 6, 3826);
    			add_location(b24, file$e, 106, 10, 3900);
    			add_location(li22, file$e, 106, 6, 3896);
    			add_location(ul2, file$e, 87, 4, 3213);
    			add_location(li23, file$e, 84, 2, 3070);
    			add_location(br11, file$e, 109, 2, 3982);
    			add_location(b25, file$e, 111, 4, 4000);
    			add_location(li24, file$e, 110, 2, 3991);
    			add_location(br12, file$e, 115, 2, 4238);
    			add_location(b26, file$e, 117, 4, 4256);
    			add_location(br13, file$e, 120, 4, 4482);
    			add_location(b27, file$e, 122, 6, 4524);
    			set_style(span, "color", "red");
    			add_location(span, file$e, 121, 4, 4493);
    			add_location(li25, file$e, 116, 2, 4247);
    			add_location(ul3, file$e, 12, 0, 442);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$e, 128, 0, 4746);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, pre, anchor);
    			append_dev(pre, b0);
    			append_dev(pre, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, ul3, anchor);
    			append_dev(ul3, li5);
    			append_dev(li5, b1);
    			append_dev(li5, t8);
    			append_dev(li5, br0);
    			append_dev(li5, t9);
    			append_dev(li5, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, b2);
    			append_dev(li0, t11);
    			append_dev(ul0, t12);
    			append_dev(ul0, li1);
    			append_dev(li1, b3);
    			append_dev(li1, t14);
    			append_dev(ul0, t15);
    			append_dev(ul0, li2);
    			append_dev(li2, b4);
    			append_dev(li2, t17);
    			append_dev(li2, br1);
    			append_dev(li2, t18);
    			append_dev(li2, br2);
    			append_dev(li2, t19);
    			append_dev(li2, br3);
    			append_dev(ul0, t20);
    			append_dev(ul0, li3);
    			append_dev(li3, b5);
    			append_dev(li3, t22);
    			append_dev(li3, br4);
    			append_dev(li3, t23);
    			append_dev(li3, br5);
    			append_dev(li3, t24);
    			append_dev(li3, br6);
    			append_dev(ul0, t25);
    			append_dev(ul0, li4);
    			append_dev(li4, b6);
    			append_dev(li4, t27);
    			append_dev(li4, br7);
    			append_dev(li4, t28);
    			append_dev(li4, br8);
    			append_dev(li4, t29);
    			append_dev(li4, br9);
    			append_dev(ul3, t30);
    			append_dev(ul3, li14);
    			append_dev(li14, b7);
    			append_dev(li14, t32);
    			append_dev(li14, ul1);
    			append_dev(ul1, li6);
    			append_dev(li6, b8);
    			append_dev(li6, t34);
    			append_dev(ul1, t35);
    			append_dev(ul1, li7);
    			append_dev(li7, b9);
    			append_dev(li7, t37);
    			append_dev(ul1, t38);
    			append_dev(ul1, li8);
    			append_dev(li8, b10);
    			append_dev(li8, t40);
    			append_dev(ul1, t41);
    			append_dev(ul1, li9);
    			append_dev(li9, b11);
    			append_dev(li9, t43);
    			append_dev(ul1, t44);
    			append_dev(ul1, li10);
    			append_dev(li10, b12);
    			append_dev(li10, t46);
    			append_dev(ul1, t47);
    			append_dev(ul1, li11);
    			append_dev(li11, b13);
    			append_dev(li11, t49);
    			append_dev(ul1, t50);
    			append_dev(ul1, li12);
    			append_dev(li12, b14);
    			append_dev(li12, t52);
    			append_dev(ul1, t53);
    			append_dev(ul1, li13);
    			append_dev(li13, b15);
    			append_dev(li13, t55);
    			append_dev(ul3, t56);
    			append_dev(ul3, br10);
    			append_dev(ul3, t57);
    			append_dev(ul3, li23);
    			append_dev(li23, b16);
    			append_dev(li23, t59);
    			append_dev(li23, ul2);
    			append_dev(ul2, li15);
    			append_dev(li15, b17);
    			append_dev(li15, t61);
    			append_dev(ul2, t62);
    			append_dev(ul2, li16);
    			append_dev(li16, b18);
    			append_dev(li16, t64);
    			append_dev(ul2, t65);
    			append_dev(ul2, li17);
    			append_dev(li17, b19);
    			append_dev(li17, t67);
    			append_dev(ul2, t68);
    			append_dev(ul2, li18);
    			append_dev(li18, b20);
    			append_dev(li18, t70);
    			append_dev(ul2, t71);
    			append_dev(ul2, li19);
    			append_dev(li19, b21);
    			append_dev(li19, t73);
    			append_dev(ul2, t74);
    			append_dev(ul2, li20);
    			append_dev(li20, b22);
    			append_dev(li20, t76);
    			append_dev(ul2, t77);
    			append_dev(ul2, li21);
    			append_dev(li21, b23);
    			append_dev(li21, t79);
    			append_dev(ul2, t80);
    			append_dev(ul2, li22);
    			append_dev(li22, b24);
    			append_dev(li22, t82);
    			append_dev(ul3, t83);
    			append_dev(ul3, br11);
    			append_dev(ul3, t84);
    			append_dev(ul3, li24);
    			append_dev(li24, b25);
    			append_dev(li24, t86);
    			append_dev(ul3, t87);
    			append_dev(ul3, br12);
    			append_dev(ul3, t88);
    			append_dev(ul3, li25);
    			append_dev(li25, b26);
    			append_dev(li25, t90);
    			append_dev(li25, br13);
    			append_dev(li25, t91);
    			append_dev(li25, span);
    			append_dev(span, b27);
    			append_dev(span, t93);
    			insert_dev(target, t94, anchor);
    			insert_dev(target, p1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(pre);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(ul3);
    			if (detaching) detach_dev(t94);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_BeforeEnterRouteAnatomy", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_BeforeEnterRouteAnatomy> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SCR_BeforeEnterRouteAnatomy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_BeforeEnterRouteAnatomy",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/docs/pages/SCR_ConfigurationBeforeEnter.svelte generated by Svelte v3.37.0 */
    const file$d = "src/docs/pages/SCR_ConfigurationBeforeEnter.svelte";

    // (29:12) <SCR_ROUTER_LINK       to={{ name: "routeObjectOptionsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$5(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Route Object Properties";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$d, 32, 6, 1468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(29:12) <SCR_ROUTER_LINK       to={{ name: \\\"routeObjectOptionsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (73:2) <SCR_PageFooter>
    function create_default_slot$c(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "configurationOptionsRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "configurationOnErrorOptionRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$d, 74, 6, 2958);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$d, 73, 4, 2934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(73:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let p;
    	let t2;
    	let b0;
    	let t4;
    	let b1;
    	let t6;
    	let br0;
    	let t7;
    	let br1;
    	let t8;
    	let br2;
    	let t9;
    	let br3;
    	let t10;
    	let b2;
    	let t12;
    	let br4;
    	let t13;
    	let br5;
    	let t14;
    	let scr_router_link;
    	let t15;
    	let br6;
    	let t16;
    	let br7;
    	let t17;
    	let t18;
    	let pre0;
    	let b3;
    	let t20;
    	let b4;
    	let t22;
    	let b5;
    	let t24;
    	let b6;
    	let t26;
    	let b7;
    	let t28;
    	let b8;
    	let t30;
    	let b9;
    	let t32;
    	let t33;
    	let br8;
    	let t34;
    	let scr_beforeenterrouteanatomy;
    	let t35;
    	let center;
    	let small;
    	let t37;
    	let pre1;
    	let t39;
    	let scr_pagefooter;
    	let current;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectOptionsRoute" },
    				elementProps: {
    					style: "display: inline; cursor: pointer;"
    				},
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_beforeenterrouteanatomy = new SCR_BeforeEnterRouteAnatomy({ $$inline: true });

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Configuration - Before Enter Function";
    			t1 = space();
    			p = element("p");
    			t2 = text("The ");
    			b0 = element("b");
    			b0.textContent = "beforeEnter";
    			t4 = text(" option sets an array of functions or just a function\n    that must be executed for before each route if the option\n    ");
    			b1 = element("b");
    			b1.textContent = "ignoreGlobalBeforeFunction";
    			t6 = text("\n    isn't set in the route definition object.\n    ");
    			br0 = element("br");
    			t7 = space();
    			br1 = element("br");
    			t8 = text("\n    The default order of execution is first execute all Global Before Functions and\n    then execute route object before enter functions. But for a particular route\n    the behaviour maybe different. Maybe it is needed to execute the route before\n    function before Global Before Functions.\n    ");
    			br2 = element("br");
    			t9 = space();
    			br3 = element("br");
    			t10 = text("\n    If that is the case then you can set in the route object the option\n    ");
    			b2 = element("b");
    			b2.textContent = "executeRouteBEFBeforeGlobalBEF";
    			t12 = text(" to true. When this option is enabled\n    in the route definition object the default order of execution is overrided\n    and executes route object before functions before Global Before Functions.\n    ");
    			br4 = element("br");
    			t13 = space();
    			br5 = element("br");
    			t14 = text("\n    See the ");
    			create_component(scr_router_link.$$.fragment);
    			t15 = text(" for more info.\n    ");
    			br6 = element("br");
    			t16 = space();
    			br7 = element("br");
    			t17 = text("\n    See the next example of how to set this option:");
    			t18 = space();
    			pre0 = element("pre");
    			b3 = element("b");
    			b3.textContent = "// importing the SCR - The configuration store";
    			t20 = text("\nimport { SCR_CONFIG_STORE } from \"svelte-client-router\"\n\n");
    			b4 = element("b");
    			b4.textContent = "// ------ SETTING A FUNCTION ------";
    			t22 = text("\n");
    			b5 = element("b");
    			b5.textContent = "// Setting Global Before Enter Function";
    			t24 = text("\nSCR_CONFIG_STORE.setBeforeEnter((resolve) => { resolve(true); });\n\n");
    			b6 = element("b");
    			b6.textContent = "// OR";
    			t26 = text("\n\n");
    			b7 = element("b");
    			b7.textContent = "// ------ SETTING AN ARRAY OF FUNCTIONS ------";
    			t28 = text("\n");
    			b8 = element("b");
    			b8.textContent = "// Setting Global Before Enter Functions";
    			t30 = text("\n");
    			b9 = element("b");
    			b9.textContent = "// You can set as many Before Enter Functions as you want!";
    			t32 = text("\nSCR_CONFIG_STORE.setBeforeEnter([\n  (resolve) => { resolve(true); },\n  (resolve) => { resolve(true); },\n  (resolve) => { resolve(true); },\n]);");
    			t33 = space();
    			br8 = element("br");
    			t34 = space();
    			create_component(scr_beforeenterrouteanatomy.$$.fragment);
    			t35 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t37 = space();
    			pre1 = element("pre");
    			pre1.textContent = "{\n    name: \"configurationGlobalBeforeEnterOptionRoute\",\n    path: \"/svelte-client-router/configurationBeforeEnter\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_ConfigurationBeforeEnter.svelte\"),\n    title: \"SCR - Configuration - Before Enter\",\n}";
    			t39 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$d, 8, 2, 326);
    			add_location(b0, file$d, 10, 8, 427);
    			add_location(b1, file$d, 12, 4, 565);
    			add_location(br0, file$d, 14, 4, 649);
    			add_location(br1, file$d, 15, 4, 660);
    			add_location(br2, file$d, 20, 4, 963);
    			add_location(br3, file$d, 21, 4, 974);
    			add_location(b2, file$d, 23, 4, 1057);
    			add_location(br4, file$d, 26, 4, 1294);
    			add_location(br5, file$d, 27, 4, 1305);
    			add_location(br6, file$d, 34, 4, 1580);
    			add_location(br7, file$d, 35, 4, 1591);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$d, 9, 2, 390);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$d, 40, 0, 1685);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$d, 43, 0, 1820);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$d, 44, 0, 1878);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$d, 47, 0, 2019);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$d, 49, 0, 2048);
    			attr_dev(b8, "class", "scr-b");
    			add_location(b8, file$d, 50, 0, 2117);
    			attr_dev(b9, "class", "scr-b");
    			add_location(b9, file$d, 51, 0, 2179);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$d, 38, 2, 1659);
    			add_location(br8, file$d, 58, 2, 2452);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$d, 61, 4, 2527);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$d, 60, 2, 2495);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$d, 63, 2, 2608);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$d, 7, 0, 301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(p, b0);
    			append_dev(p, t4);
    			append_dev(p, b1);
    			append_dev(p, t6);
    			append_dev(p, br0);
    			append_dev(p, t7);
    			append_dev(p, br1);
    			append_dev(p, t8);
    			append_dev(p, br2);
    			append_dev(p, t9);
    			append_dev(p, br3);
    			append_dev(p, t10);
    			append_dev(p, b2);
    			append_dev(p, t12);
    			append_dev(p, br4);
    			append_dev(p, t13);
    			append_dev(p, br5);
    			append_dev(p, t14);
    			mount_component(scr_router_link, p, null);
    			append_dev(p, t15);
    			append_dev(p, br6);
    			append_dev(p, t16);
    			append_dev(p, br7);
    			append_dev(p, t17);
    			append_dev(div, t18);
    			append_dev(div, pre0);
    			append_dev(pre0, b3);
    			append_dev(pre0, t20);
    			append_dev(pre0, b4);
    			append_dev(pre0, t22);
    			append_dev(pre0, b5);
    			append_dev(pre0, t24);
    			append_dev(pre0, b6);
    			append_dev(pre0, t26);
    			append_dev(pre0, b7);
    			append_dev(pre0, t28);
    			append_dev(pre0, b8);
    			append_dev(pre0, t30);
    			append_dev(pre0, b9);
    			append_dev(pre0, t32);
    			append_dev(div, t33);
    			append_dev(div, br8);
    			append_dev(div, t34);
    			mount_component(scr_beforeenterrouteanatomy, div, null);
    			append_dev(div, t35);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t37);
    			append_dev(div, pre1);
    			append_dev(div, t39);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_router_link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link.$set(scr_router_link_changes);
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_router_link.$$.fragment, local);
    			transition_in(scr_beforeenterrouteanatomy.$$.fragment, local);
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_link.$$.fragment, local);
    			transition_out(scr_beforeenterrouteanatomy.$$.fragment, local);
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_router_link);
    			destroy_component(scr_beforeenterrouteanatomy);
    			destroy_component(scr_pagefooter);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_ConfigurationBeforeEnter", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_ConfigurationBeforeEnter> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton,
    		SCR_BeforeEnterRouteAnatomy
    	});

    	return [];
    }

    class SCR_ConfigurationBeforeEnter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_ConfigurationBeforeEnter",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    var SCR_ConfigurationBeforeEnter$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_ConfigurationBeforeEnter
    });

    /* src/docs/components/SCR_OnErrorAnatomy.svelte generated by Svelte v3.37.0 */

    const file$c = "src/docs/components/SCR_OnErrorAnatomy.svelte";

    function create_fragment$c(ctx) {
    	let h4;
    	let t1;
    	let p;
    	let t2;
    	let br0;
    	let t3;
    	let t4;
    	let pre;
    	let b0;
    	let t6;
    	let t7;
    	let ul3;
    	let li0;
    	let b1;
    	let t9;
    	let t10;
    	let li20;
    	let b2;
    	let t12;
    	let br1;
    	let t13;
    	let ul2;
    	let li9;
    	let b3;
    	let t15;
    	let ul0;
    	let li1;
    	let b4;
    	let t17;
    	let t18;
    	let li2;
    	let b5;
    	let t20;
    	let t21;
    	let li3;
    	let b6;
    	let t23;
    	let t24;
    	let li4;
    	let b7;
    	let t26;
    	let t27;
    	let li5;
    	let b8;
    	let t29;
    	let t30;
    	let li6;
    	let b9;
    	let t32;
    	let t33;
    	let li7;
    	let b10;
    	let t35;
    	let t36;
    	let li8;
    	let b11;
    	let t38;
    	let t39;
    	let br2;
    	let t40;
    	let li18;
    	let b12;
    	let t42;
    	let ul1;
    	let li10;
    	let b13;
    	let t44;
    	let t45;
    	let li11;
    	let b14;
    	let t47;
    	let t48;
    	let li12;
    	let b15;
    	let t50;
    	let t51;
    	let li13;
    	let b16;
    	let t53;
    	let t54;
    	let li14;
    	let b17;
    	let t56;
    	let t57;
    	let li15;
    	let b18;
    	let t59;
    	let t60;
    	let li16;
    	let b19;
    	let t62;
    	let t63;
    	let li17;
    	let b20;
    	let t65;
    	let t66;
    	let br3;
    	let t67;
    	let li19;
    	let b21;
    	let t69;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Anatomy of the On Error Function";
    			t1 = space();
    			p = element("p");
    			t2 = text("When declaring a On Error Function it will be provided some parameters for you\n  to deal with the issue.\n  ");
    			br0 = element("br");
    			t3 = text("\n  Lets check them in order of declaration:");
    			t4 = space();
    			pre = element("pre");
    			b0 = element("b");
    			b0.textContent = "// Example of On Error function declaration";
    			t6 = text("\n(err, routeObjParams) => { \n  console.error(err);\n}");
    			t7 = space();
    			ul3 = element("ul");
    			li0 = element("li");
    			b1 = element("b");
    			b1.textContent = "err:";
    			t9 = text(" The error object containing the error information");
    			t10 = space();
    			li20 = element("li");
    			b2 = element("b");
    			b2.textContent = "routeObjParams: ";
    			t12 = text("All the parameters passed until that error has\n    occurred.\n    ");
    			br1 = element("br");
    			t13 = text("\n    This is a composed object and it has the following parameters:\n    ");
    			ul2 = element("ul");
    			li9 = element("li");
    			b3 = element("b");
    			b3.textContent = "currentRoute:";
    			t15 = text(" The current route object containing the\n        information of the route that the user is trying to access. It is\n        composed by the following params:\n        ");
    			ul0 = element("ul");
    			li1 = element("li");
    			b4 = element("b");
    			b4.textContent = "name: ";
    			t17 = text("The name of the route");
    			t18 = space();
    			li2 = element("li");
    			b5 = element("b");
    			b5.textContent = "hash: ";
    			t20 = text("The hash value of the route");
    			t21 = space();
    			li3 = element("li");
    			b6 = element("b");
    			b6.textContent = "hostname: ";
    			t23 = text("The hostname of the route. For example: \"localhost\"");
    			t24 = space();
    			li4 = element("li");
    			b7 = element("b");
    			b7.textContent = "origin: ";
    			t26 = text("The origin of the route. For example:\n            \"http://localhost:5000\"");
    			t27 = space();
    			li5 = element("li");
    			b8 = element("b");
    			b8.textContent = "params: ";
    			t29 = text("The query params of the route. For example: {\n            testParam: \"someParamValue\" }");
    			t30 = space();
    			li6 = element("li");
    			b9 = element("b");
    			b9.textContent = "pathname: ";
    			t32 = text("The path of the route. For example:\n            \"/svelte-client-router/configurationBeforeEnter\"");
    			t33 = space();
    			li7 = element("li");
    			b10 = element("b");
    			b10.textContent = "port: ";
    			t35 = text("The port of the host. For example: \"5000\"");
    			t36 = space();
    			li8 = element("li");
    			b11 = element("b");
    			b11.textContent = "protocol: ";
    			t38 = text("The protocol used. For example: \"http:\"");
    			t39 = space();
    			br2 = element("br");
    			t40 = space();
    			li18 = element("li");
    			b12 = element("b");
    			b12.textContent = "fromRoute:";
    			t42 = text(" The coming from route object containing the\n        information of the route that the user is coming from. It is composed by\n        the following params:\n        ");
    			ul1 = element("ul");
    			li10 = element("li");
    			b13 = element("b");
    			b13.textContent = "name: ";
    			t44 = text("The name of the route");
    			t45 = space();
    			li11 = element("li");
    			b14 = element("b");
    			b14.textContent = "hash: ";
    			t47 = text("The hash value of the route");
    			t48 = space();
    			li12 = element("li");
    			b15 = element("b");
    			b15.textContent = "hostname: ";
    			t50 = text("The hostname of the route. For example: \"localhost\"");
    			t51 = space();
    			li13 = element("li");
    			b16 = element("b");
    			b16.textContent = "origin: ";
    			t53 = text("The origin of the route. For example:\n            \"http://localhost:5000\"");
    			t54 = space();
    			li14 = element("li");
    			b17 = element("b");
    			b17.textContent = "params: ";
    			t56 = text("The query params of the route. For example: {\n            testParam: \"someParamValue\" }");
    			t57 = space();
    			li15 = element("li");
    			b18 = element("b");
    			b18.textContent = "pathname: ";
    			t59 = text("The path of the route. For example:\n            \"/svelte-client-router/configurationBeforeEnter\"");
    			t60 = space();
    			li16 = element("li");
    			b19 = element("b");
    			b19.textContent = "port: ";
    			t62 = text("The port of the host. For example: \"5000\"");
    			t63 = space();
    			li17 = element("li");
    			b20 = element("b");
    			b20.textContent = "protocol: ";
    			t65 = text("The protocol used. For example: \"http:\"");
    			t66 = space();
    			br3 = element("br");
    			t67 = space();
    			li19 = element("li");
    			b21 = element("b");
    			b21.textContent = "routeObjParams:";
    			t69 = text(" all the parameters passed until the moment of the\n        error, including any defined payload properties.");
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$c, 0, 0, 0);
    			add_location(br0, file$c, 4, 2, 195);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$c, 1, 0, 57);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$c, 9, 0, 274);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file$c, 7, 0, 250);
    			add_location(b1, file$c, 16, 4, 429);
    			add_location(li0, file$c, 15, 2, 420);
    			add_location(b2, file$c, 19, 4, 511);
    			add_location(br1, file$c, 21, 4, 599);
    			add_location(b3, file$c, 25, 8, 701);
    			add_location(b4, file$c, 29, 14, 906);
    			add_location(li1, file$c, 29, 10, 902);
    			add_location(b5, file$c, 30, 14, 960);
    			add_location(li2, file$c, 30, 10, 956);
    			add_location(b6, file$c, 32, 12, 1033);
    			add_location(li3, file$c, 31, 10, 1016);
    			add_location(b7, file$c, 35, 12, 1145);
    			add_location(li4, file$c, 34, 10, 1128);
    			add_location(b8, file$c, 39, 12, 1277);
    			add_location(li5, file$c, 38, 10, 1260);
    			add_location(b9, file$c, 43, 12, 1432);
    			add_location(li6, file$c, 42, 10, 1415);
    			add_location(b10, file$c, 46, 14, 1576);
    			add_location(li7, file$c, 46, 10, 1572);
    			add_location(b11, file$c, 47, 14, 1650);
    			add_location(li8, file$c, 47, 10, 1646);
    			add_location(ul0, file$c, 28, 8, 887);
    			add_location(li9, file$c, 24, 6, 688);
    			add_location(br2, file$c, 50, 6, 1744);
    			add_location(b12, file$c, 52, 8, 1770);
    			add_location(b13, file$c, 56, 14, 1971);
    			add_location(li10, file$c, 56, 10, 1967);
    			add_location(b14, file$c, 57, 14, 2025);
    			add_location(li11, file$c, 57, 10, 2021);
    			add_location(b15, file$c, 59, 12, 2098);
    			add_location(li12, file$c, 58, 10, 2081);
    			add_location(b16, file$c, 62, 12, 2210);
    			add_location(li13, file$c, 61, 10, 2193);
    			add_location(b17, file$c, 66, 12, 2342);
    			add_location(li14, file$c, 65, 10, 2325);
    			add_location(b18, file$c, 70, 12, 2497);
    			add_location(li15, file$c, 69, 10, 2480);
    			add_location(b19, file$c, 73, 14, 2641);
    			add_location(li16, file$c, 73, 10, 2637);
    			add_location(b20, file$c, 74, 14, 2715);
    			add_location(li17, file$c, 74, 10, 2711);
    			add_location(ul1, file$c, 55, 8, 1952);
    			add_location(li18, file$c, 51, 6, 1757);
    			add_location(br3, file$c, 77, 6, 2809);
    			add_location(b21, file$c, 79, 8, 2835);
    			add_location(li19, file$c, 78, 6, 2822);
    			add_location(ul2, file$c, 23, 4, 677);
    			add_location(li20, file$c, 18, 2, 502);
    			add_location(ul3, file$c, 14, 0, 413);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, br0);
    			append_dev(p, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, pre, anchor);
    			append_dev(pre, b0);
    			append_dev(pre, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, ul3, anchor);
    			append_dev(ul3, li0);
    			append_dev(li0, b1);
    			append_dev(li0, t9);
    			append_dev(ul3, t10);
    			append_dev(ul3, li20);
    			append_dev(li20, b2);
    			append_dev(li20, t12);
    			append_dev(li20, br1);
    			append_dev(li20, t13);
    			append_dev(li20, ul2);
    			append_dev(ul2, li9);
    			append_dev(li9, b3);
    			append_dev(li9, t15);
    			append_dev(li9, ul0);
    			append_dev(ul0, li1);
    			append_dev(li1, b4);
    			append_dev(li1, t17);
    			append_dev(ul0, t18);
    			append_dev(ul0, li2);
    			append_dev(li2, b5);
    			append_dev(li2, t20);
    			append_dev(ul0, t21);
    			append_dev(ul0, li3);
    			append_dev(li3, b6);
    			append_dev(li3, t23);
    			append_dev(ul0, t24);
    			append_dev(ul0, li4);
    			append_dev(li4, b7);
    			append_dev(li4, t26);
    			append_dev(ul0, t27);
    			append_dev(ul0, li5);
    			append_dev(li5, b8);
    			append_dev(li5, t29);
    			append_dev(ul0, t30);
    			append_dev(ul0, li6);
    			append_dev(li6, b9);
    			append_dev(li6, t32);
    			append_dev(ul0, t33);
    			append_dev(ul0, li7);
    			append_dev(li7, b10);
    			append_dev(li7, t35);
    			append_dev(ul0, t36);
    			append_dev(ul0, li8);
    			append_dev(li8, b11);
    			append_dev(li8, t38);
    			append_dev(ul2, t39);
    			append_dev(ul2, br2);
    			append_dev(ul2, t40);
    			append_dev(ul2, li18);
    			append_dev(li18, b12);
    			append_dev(li18, t42);
    			append_dev(li18, ul1);
    			append_dev(ul1, li10);
    			append_dev(li10, b13);
    			append_dev(li10, t44);
    			append_dev(ul1, t45);
    			append_dev(ul1, li11);
    			append_dev(li11, b14);
    			append_dev(li11, t47);
    			append_dev(ul1, t48);
    			append_dev(ul1, li12);
    			append_dev(li12, b15);
    			append_dev(li12, t50);
    			append_dev(ul1, t51);
    			append_dev(ul1, li13);
    			append_dev(li13, b16);
    			append_dev(li13, t53);
    			append_dev(ul1, t54);
    			append_dev(ul1, li14);
    			append_dev(li14, b17);
    			append_dev(li14, t56);
    			append_dev(ul1, t57);
    			append_dev(ul1, li15);
    			append_dev(li15, b18);
    			append_dev(li15, t59);
    			append_dev(ul1, t60);
    			append_dev(ul1, li16);
    			append_dev(li16, b19);
    			append_dev(li16, t62);
    			append_dev(ul1, t63);
    			append_dev(ul1, li17);
    			append_dev(li17, b20);
    			append_dev(li17, t65);
    			append_dev(ul2, t66);
    			append_dev(ul2, br3);
    			append_dev(ul2, t67);
    			append_dev(ul2, li19);
    			append_dev(li19, b21);
    			append_dev(li19, t69);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(pre);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(ul3);
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

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_OnErrorAnatomy", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_OnErrorAnatomy> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SCR_OnErrorAnatomy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_OnErrorAnatomy",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/docs/pages/SCR_ConfigurationOnError.svelte generated by Svelte v3.37.0 */
    const file$b = "src/docs/pages/SCR_ConfigurationOnError.svelte";

    // (19:12) <SCR_ROUTER_LINK       to={{ name: "routeComponentComponentsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$4(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Route Component Components";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$b, 22, 6, 941);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(19:12) <SCR_ROUTER_LINK       to={{ name: \\\"routeComponentComponentsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (53:2) <SCR_PageFooter>
    function create_default_slot$b(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "configurationGlobalBeforeEnterOptionRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "routeObjectOptionsRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$b, 54, 6, 2029);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$b, 53, 4, 2005);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(53:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let p0;
    	let t2;
    	let b0;
    	let t4;
    	let br0;
    	let t5;
    	let br1;
    	let t6;
    	let br2;
    	let t7;
    	let scr_router_link;
    	let t8;
    	let t9;
    	let pre0;
    	let b1;
    	let t11;
    	let b2;
    	let t13;
    	let t14;
    	let br3;
    	let t15;
    	let scr_onerroranatomy;
    	let t16;
    	let p1;
    	let t18;
    	let center;
    	let small;
    	let t20;
    	let pre1;
    	let t22;
    	let scr_pagefooter;
    	let current;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeComponentComponentsRoute" },
    				elementProps: {
    					style: "display: inline; cursor: pointer;"
    				},
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_onerroranatomy = new SCR_OnErrorAnatomy({ $$inline: true });

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Configuration - On Error Function";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("The ");
    			b0 = element("b");
    			b0.textContent = "onError";
    			t4 = text(" option sets a function that is going to be executed for\n    any route when something goes wrong.\n    ");
    			br0 = element("br");
    			t5 = space();
    			br1 = element("br");
    			t6 = text("\n    When that happens the natural behaviour is to open the error page. In this context\n    SCR has a very basic error component that comes with it. You can of course set\n    you own error component and it is encouraged to do so.\n    ");
    			br2 = element("br");
    			t7 = text("\n    See the ");
    			create_component(scr_router_link.$$.fragment);
    			t8 = text(" for more info.");
    			t9 = space();
    			pre0 = element("pre");
    			b1 = element("b");
    			b1.textContent = "// importing the SCR - The configuration store";
    			t11 = text("\nimport { SCR_CONFIG_STORE } from \"svelte-client-router\"\n\n");
    			b2 = element("b");
    			b2.textContent = "// Setting Global On Error Function";
    			t13 = text("\nSCR_CONFIG_STORE.setOnError((err, routeObjParams) => { console.error(err) });");
    			t14 = space();
    			br3 = element("br");
    			t15 = space();
    			create_component(scr_onerroranatomy.$$.fragment);
    			t16 = space();
    			p1 = element("p");
    			p1.textContent = "So that is it for this section. This feature enables us to handle any errors\n    that may occur inside our routing definitions.";
    			t18 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t20 = space();
    			pre1 = element("pre");
    			pre1.textContent = "{\n    name: \"configurationOnErrorOptionRoute\",\n    path: \"/svelte-client-router/configurationOnError\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_ConfigurationOnError.svelte\"),\n    title: \"SCR - Configuration - On Error\",\n}";
    			t22 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$b, 8, 2, 308);
    			add_location(b0, file$b, 10, 8, 405);
    			add_location(br0, file$b, 12, 4, 521);
    			add_location(br1, file$b, 13, 4, 532);
    			add_location(br2, file$b, 17, 4, 772);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$b, 9, 2, 368);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$b, 27, 0, 1087);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$b, 30, 0, 1222);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$b, 25, 2, 1061);
    			add_location(br3, file$b, 33, 2, 1381);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$b, 36, 2, 1418);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$b, 41, 4, 1620);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$b, 40, 2, 1588);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$b, 43, 2, 1701);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$b, 7, 0, 283);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, b0);
    			append_dev(p0, t4);
    			append_dev(p0, br0);
    			append_dev(p0, t5);
    			append_dev(p0, br1);
    			append_dev(p0, t6);
    			append_dev(p0, br2);
    			append_dev(p0, t7);
    			mount_component(scr_router_link, p0, null);
    			append_dev(p0, t8);
    			append_dev(div, t9);
    			append_dev(div, pre0);
    			append_dev(pre0, b1);
    			append_dev(pre0, t11);
    			append_dev(pre0, b2);
    			append_dev(pre0, t13);
    			append_dev(div, t14);
    			append_dev(div, br3);
    			append_dev(div, t15);
    			mount_component(scr_onerroranatomy, div, null);
    			append_dev(div, t16);
    			append_dev(div, p1);
    			append_dev(div, t18);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t20);
    			append_dev(div, pre1);
    			append_dev(div, t22);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_router_link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link.$set(scr_router_link_changes);
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_router_link.$$.fragment, local);
    			transition_in(scr_onerroranatomy.$$.fragment, local);
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_link.$$.fragment, local);
    			transition_out(scr_onerroranatomy.$$.fragment, local);
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_router_link);
    			destroy_component(scr_onerroranatomy);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_ConfigurationOnError", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_ConfigurationOnError> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton,
    		SCR_OnErrorAnatomy
    	});

    	return [];
    }

    class SCR_ConfigurationOnError extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_ConfigurationOnError",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    var SCR_ConfigurationOnError$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_ConfigurationOnError
    });

    /* src/docs/pages/SCR_RouteObjectProperties.svelte generated by Svelte v3.37.0 */
    const file$a = "src/docs/pages/SCR_RouteObjectProperties.svelte";

    // (421:2) <SCR_PageFooter>
    function create_default_slot$a(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "configurationOnErrorOptionRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "routeObjectBeforeEnterRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$a, 422, 6, 14094);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$a, 421, 4, 14070);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(421:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let h40;
    	let t1;
    	let p0;
    	let t2;
    	let br0;
    	let t3;
    	let t4;
    	let hr0;
    	let t5;
    	let h41;
    	let t7;
    	let p1;
    	let t8;
    	let b0;
    	let t10;
    	let br1;
    	let t11;
    	let t12;
    	let pre0;
    	let b1;
    	let t14;
    	let t15;
    	let hr1;
    	let t16;
    	let h42;
    	let t18;
    	let p2;
    	let t19;
    	let b2;
    	let t21;
    	let br2;
    	let t22;
    	let br3;
    	let t23;
    	let br4;
    	let t24;
    	let br5;
    	let t25;
    	let br6;
    	let t26;
    	let b3;
    	let t28;
    	let br7;
    	let t29;
    	let br8;
    	let t30;
    	let t31;
    	let pre1;
    	let b4;
    	let t33;
    	let b5;
    	let t35;
    	let b6;
    	let t37;
    	let t38;
    	let hr2;
    	let t39;
    	let h43;
    	let t41;
    	let p3;
    	let t42;
    	let b7;
    	let t44;
    	let br9;
    	let t45;
    	let br10;
    	let t46;
    	let t47;
    	let pre2;
    	let b8;
    	let t49;
    	let b9;
    	let t51;
    	let b10;
    	let t53;
    	let t54;
    	let hr3;
    	let t55;
    	let h44;
    	let t57;
    	let p4;
    	let t58;
    	let b11;
    	let t60;
    	let br11;
    	let t61;
    	let br12;
    	let t62;
    	let t63;
    	let pre3;
    	let b12;
    	let t65;
    	let b13;
    	let t67;
    	let t68;
    	let hr4;
    	let t69;
    	let h45;
    	let t71;
    	let p5;
    	let t72;
    	let b14;
    	let t74;
    	let br13;
    	let t75;
    	let br14;
    	let t76;
    	let t77;
    	let pre4;
    	let b15;
    	let t79;
    	let b16;
    	let t81;
    	let b17;
    	let t83;
    	let t84;
    	let hr5;
    	let t85;
    	let h46;
    	let t87;
    	let p6;
    	let t88;
    	let b18;
    	let t90;
    	let br15;
    	let t91;
    	let br16;
    	let t92;
    	let t93;
    	let pre5;
    	let b19;
    	let t95;
    	let b20;
    	let t97;
    	let t98;
    	let hr6;
    	let t99;
    	let h47;
    	let t101;
    	let p7;
    	let t102;
    	let b21;
    	let t104;
    	let br17;
    	let t105;
    	let t106;
    	let pre6;
    	let b22;
    	let t108;
    	let t109;
    	let hr7;
    	let t110;
    	let h48;
    	let t112;
    	let p8;
    	let t113;
    	let b23;
    	let t115;
    	let br18;
    	let t116;
    	let br19;
    	let t117;
    	let br20;
    	let t118;
    	let t119;
    	let pre7;
    	let b24;
    	let t121;
    	let t122;
    	let hr8;
    	let t123;
    	let h49;
    	let t125;
    	let p9;
    	let t126;
    	let b25;
    	let t128;
    	let t129;
    	let pre8;
    	let b26;
    	let t131;
    	let t132;
    	let hr9;
    	let t133;
    	let h410;
    	let t135;
    	let p10;
    	let t136;
    	let b27;
    	let t138;
    	let t139;
    	let pre9;
    	let b28;
    	let t141;
    	let t142;
    	let hr10;
    	let t143;
    	let h411;
    	let t145;
    	let p11;
    	let t146;
    	let b29;
    	let t148;
    	let b30;
    	let t150;
    	let t151;
    	let pre10;
    	let b31;
    	let t153;
    	let t154;
    	let hr11;
    	let t155;
    	let h412;
    	let t157;
    	let p12;
    	let t158;
    	let b32;
    	let t160;
    	let t161;
    	let pre11;
    	let b33;
    	let t163;
    	let t164;
    	let hr12;
    	let t165;
    	let h413;
    	let t167;
    	let p13;
    	let t168;
    	let b34;
    	let t170;
    	let t171;
    	let pre12;
    	let b35;
    	let t173;
    	let t174;
    	let hr13;
    	let t175;
    	let h414;
    	let t177;
    	let p14;
    	let t178;
    	let b36;
    	let t180;
    	let br21;
    	let t181;
    	let t182;
    	let pre13;
    	let b37;
    	let t184;
    	let t185;
    	let hr14;
    	let t186;
    	let h415;
    	let t188;
    	let p15;
    	let t189;
    	let b38;
    	let t191;
    	let br22;
    	let t192;
    	let br23;
    	let t193;
    	let t194;
    	let pre14;
    	let b39;
    	let t196;
    	let t197;
    	let p16;
    	let t199;
    	let center;
    	let small;
    	let t201;
    	let pre15;
    	let t203;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			h40.textContent = "Route Object - Properties";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("This is where we can declare our routes. It has several option that\n    modelates the route behaviour.\n    ");
    			br0 = element("br");
    			t3 = text("\n    There is some mandatory properties that configure a minimal route declaration.\n    Lets check each option:");
    			t4 = space();
    			hr0 = element("hr");
    			t5 = space();
    			h41 = element("h4");
    			h41.textContent = "Name";
    			t7 = space();
    			p1 = element("p");
    			t8 = text("The ");
    			b0 = element("b");
    			b0.textContent = "name";
    			t10 = text(" option is mandatory. It an humam readable identification for\n    this route.\n    ");
    			br1 = element("br");
    			t11 = text("\n    As it is an identification property must be unique. If some route is declared\n    with the same name, it will always find the first route with that name and route\n    to it.");
    			t12 = space();
    			pre0 = element("pre");
    			b1 = element("b");
    			b1.textContent = "// ## Route Name\n// ## The name identifying this route\n// ## String - Obrigatory\n// ## Default value: none";
    			t14 = text("\n{\n  name: \"exampleOfRouteName\",\n}");
    			t15 = space();
    			hr1 = element("hr");
    			t16 = space();
    			h42 = element("h4");
    			h42.textContent = "Path";
    			t18 = space();
    			p2 = element("p");
    			t19 = text("The ");
    			b2 = element("b");
    			b2.textContent = "path";
    			t21 = text(" is mandatory and it is the path to route to.\n    ");
    			br2 = element("br");
    			t22 = space();
    			br3 = element("br");
    			t23 = text("\n    As it is an identification property must be unique. If some route is declared\n    with the same path, it will always find the first route with that path and route\n    to it.\n    ");
    			br4 = element("br");
    			t24 = space();
    			br5 = element("br");
    			t25 = text("\n    You can use regex in your route like \":myVar\". For example:\n    ");
    			br6 = element("br");
    			t26 = space();
    			b3 = element("b");
    			b3.textContent = "path: \"/path/:someVar/my/route/:someOtherVar\",";
    			t28 = space();
    			br7 = element("br");
    			t29 = space();
    			br8 = element("br");
    			t30 = text("\n    It will be made available on all beforeEnter Functions, After Enter Function and Components;");
    			t31 = space();
    			pre1 = element("pre");
    			b4 = element("b");
    			b4.textContent = "// ## Route Path\n// ## The path identifying this route\n// ## String - Obrigatory\n// ## Can declare regex like /test1/:paramA/test2/:paramB\n// ## The regex must have the format \":string\"\n// ## Default value: none";
    			t33 = text("\n{\n  path: \"/path/to/my/route\",\n\n  ");
    			b5 = element("b");
    			b5.textContent = "// OR Can declare regex path\n  // it will be made available on all beforeEnter Functions, After Enter Function and Component";
    			t35 = text("\n  path: \"/path/:to/:my/route\",\n\n  ");
    			b6 = element("b");
    			b6.textContent = "// pathParams: {\n  //  to: \"myroutedefinedvalue\"\n  //  my: \"myroutedefinedvalue\"\n  // }";
    			t37 = text("\n}");
    			t38 = space();
    			hr2 = element("hr");
    			t39 = space();
    			h43 = element("h4");
    			h43.textContent = "Component";
    			t41 = space();
    			p3 = element("p");
    			t42 = text("The ");
    			b7 = element("b");
    			b7.textContent = "component";
    			t44 = text(" is partially mandatory. This is because if the route\n    only redirects, it will not use the loaded component.\n    ");
    			br9 = element("br");
    			t45 = space();
    			br10 = element("br");
    			t46 = text("\n    The component specified will be included inside the default slot of the Layout\n    Component.");
    			t47 = space();
    			pre2 = element("pre");
    			b8 = element("b");
    			b8.textContent = "// ## Component - the loaded component that is going to be used \n// for this route\n// ## Function - Imported component for this route\n// ## Default value: none";
    			t49 = text("\n\n");
    			b9 = element("b");
    			b9.textContent = "// Import your component";
    			t51 = text("\nimport SCR_C1 from \"./testComponents/SCR_C1.svelte\";\n\n{\n  ");
    			b10 = element("b");
    			b10.textContent = "// Setting your route component";
    			t53 = text("\n  component: SCR_C1,\n}");
    			t54 = space();
    			hr3 = element("hr");
    			t55 = space();
    			h44 = element("h4");
    			h44.textContent = "Lazy Load Component";
    			t57 = space();
    			p4 = element("p");
    			t58 = text("The ");
    			b11 = element("b");
    			b11.textContent = "lazyLoadComponent";
    			t60 = text(" is partially mandatory. This is because if the\n    route only redirects, it will not load any component.\n    ");
    			br11 = element("br");
    			t61 = space();
    			br12 = element("br");
    			t62 = text("\n    The component specified will be included inside the default slot of the Layout\n    Component.");
    			t63 = space();
    			pre3 = element("pre");
    			b12 = element("b");
    			b12.textContent = "// ## Lazy Load Component - the component that must be loaded to be used \n// ## for this route\n// ## Function - Function to load the component for this route\n// ## Default value: none";
    			t65 = text("\n\n{\n  ");
    			b13 = element("b");
    			b13.textContent = "// Lazy loading your route component";
    			t67 = text("\n  lazyLoadComponent: () => import(\"./testComponents/SCR_C1.svelte\"),\n}");
    			t68 = space();
    			hr4 = element("hr");
    			t69 = space();
    			h45 = element("h4");
    			h45.textContent = "Layout Component";
    			t71 = space();
    			p5 = element("p");
    			t72 = text("The ");
    			b14 = element("b");
    			b14.textContent = "layoutComponent";
    			t74 = text(" is a custom loaded layout to use with this\n    specific route. When set it will override any global layout set for this\n    route only.\n    ");
    			br13 = element("br");
    			t75 = space();
    			br14 = element("br");
    			t76 = text("\n    The layout component specified must have a default slot declared to include route\n    component.");
    			t77 = space();
    			pre4 = element("pre");
    			b15 = element("b");
    			b15.textContent = "// ## Layout Component - the layout component that is going to be used \n// ## for this route\n// ## Function - Imported layout component for this route\n// ## Default value: none";
    			t79 = text("\n\n");
    			b16 = element("b");
    			b16.textContent = "// Import your component";
    			t81 = text("\nimport SRC_Layout from \"./testComponents/SRC_Layout.svelte\";\n\n{\n  ");
    			b17 = element("b");
    			b17.textContent = "// Setting your route layout component";
    			t83 = text("\n  layoutComponent: SRC_Layout,\n}");
    			t84 = space();
    			hr5 = element("hr");
    			t85 = space();
    			h46 = element("h4");
    			h46.textContent = "Lazy Load Layout Component";
    			t87 = space();
    			p6 = element("p");
    			t88 = text("The ");
    			b18 = element("b");
    			b18.textContent = "lazyLoadLayoutComponent";
    			t90 = text(" is a custom layout to be loaded to use\n    with this specific route. When set it will override any global layout set\n    for this route only.\n    ");
    			br15 = element("br");
    			t91 = space();
    			br16 = element("br");
    			t92 = text("\n    The lazy layout component specified must have a default slot declared to include\n    route component.");
    			t93 = space();
    			pre5 = element("pre");
    			b19 = element("b");
    			b19.textContent = "// ## Lazy Load Layout Component - the layout component that must be loaded to be used \n// ## for this route\n// ## Function - Function to load the layout component for this route\n// ## Default value: none";
    			t95 = text("\n\n{\n  ");
    			b20 = element("b");
    			b20.textContent = "// Lazy loading your route layout component";
    			t97 = text("\n  lazyLoadLayoutComponent: () => import(\"./testComponents/SRC_Layout.svelte\"),\n}");
    			t98 = space();
    			hr6 = element("hr");
    			t99 = space();
    			h47 = element("h4");
    			h47.textContent = "Params";
    			t101 = space();
    			p7 = element("p");
    			t102 = text("The ");
    			b21 = element("b");
    			b21.textContent = "params";
    			t104 = text(" option is an object that must be available on before enter\n    functions or even the components.\n    ");
    			br17 = element("br");
    			t105 = text("\n    It will be available at any moment for you. Of course this is some fixed values.\n    See the payload param in the before enter sections to pass some custom values\n    between functions.");
    			t106 = space();
    			pre6 = element("pre");
    			b22 = element("b");
    			b22.textContent = "// ## Params - all the params the should be available\n// for this route on any Before Enter Execution or \n// After Before Enter Execution\n// ## Object\n// ## Default value: {}";
    			t108 = text("\n{\n  params: { \n    myParam: \"My Custom Param\", \n  },\n}");
    			t109 = space();
    			hr7 = element("hr");
    			t110 = space();
    			h48 = element("h4");
    			h48.textContent = "Loading Props";
    			t112 = space();
    			p8 = element("p");
    			t113 = text("The ");
    			b23 = element("b");
    			b23.textContent = "loadingProps";
    			t115 = text(" option is an object that will be available on\n    loading component.\n    ");
    			br18 = element("br");
    			t116 = text("\n    When routing the user may be waiting for some request to return and for that\n    SCR makes available a loading component. Of course you can override it and you\n    are encouraged to do so.\n    ");
    			br19 = element("br");
    			t117 = space();
    			br20 = element("br");
    			t118 = text("\n    Any properties set here will be delivered to the loading component.");
    			t119 = space();
    			pre7 = element("pre");
    			b24 = element("b");
    			b24.textContent = "// ## Loading Props - all props that must be available to\n// loading component when it is triggered\n// ## Object\n// ## Default value: {}";
    			t121 = text("\n{\n  loadingProps: { loadingText: \"Carregando...\" },\n}");
    			t122 = space();
    			hr8 = element("hr");
    			t123 = space();
    			h49 = element("h4");
    			h49.textContent = "Ignore Layout";
    			t125 = space();
    			p9 = element("p");
    			t126 = text("The ");
    			b25 = element("b");
    			b25.textContent = "ignoreLayout";
    			t128 = text(" option when set to true, ignores any layout defined to\n    this specific route.");
    			t129 = space();
    			pre8 = element("pre");
    			b26 = element("b");
    			b26.textContent = "// ## Ignore Layout - if should ignore layout component\n// ## when you do not want to use global or local layout component\n// ## Boolean\n// ## Default value: false";
    			t131 = text("\n{\n  ignoreLayout: false,\n}");
    			t132 = space();
    			hr9 = element("hr");
    			t133 = space();
    			h410 = element("h4");
    			h410.textContent = "Ignore Scroll";
    			t135 = space();
    			p10 = element("p");
    			t136 = text("The ");
    			b27 = element("b");
    			b27.textContent = "ignoreScroll";
    			t138 = text(" option when set to true, ignores any scroll behaviour\n    defined.");
    			t139 = space();
    			pre9 = element("pre");
    			b28 = element("b");
    			b28.textContent = "// ## Ignore Scroll - if this route should ignore scrolling\n// ## Boolean\n// ## Default value: false";
    			t141 = text("\n{\n  ignoreScroll: false,\n}");
    			t142 = space();
    			hr10 = element("hr");
    			t143 = space();
    			h411 = element("h4");
    			h411.textContent = "Scroll Props";
    			t145 = space();
    			p11 = element("p");
    			t146 = text("The ");
    			b29 = element("b");
    			b29.textContent = "scrollProps";
    			t148 = text(" option overrides the store ");
    			b30 = element("b");
    			b30.textContent = "scrollProps";
    			t150 = text(" configuration\n    for this specific route.");
    			t151 = space();
    			pre10 = element("pre");
    			b31 = element("b");
    			b31.textContent = "// ## Scroll Props\n// ## The scrolling props on entering the route if enabled\n// ## Default Values: \n// ## Object\n// ## Default value: configuration store";
    			t153 = text("\n{\n  scrollProps: {\n    top: 0,\n    left: 0,\n    behavior: \"smooth\",\n    timeout: 10, // timeout must be greater than 10 milliseconds\n  },\n}");
    			t154 = space();
    			hr11 = element("hr");
    			t155 = space();
    			h412 = element("h4");
    			h412.textContent = "Title";
    			t157 = space();
    			p12 = element("p");
    			t158 = text("The ");
    			b32 = element("b");
    			b32.textContent = "title";
    			t160 = text(" option sets when enters the route the page title.");
    			t161 = space();
    			pre11 = element("pre");
    			b33 = element("b");
    			b33.textContent = "// ## Title - it defines the route title\n// ## String\n// ## Default value: none";
    			t163 = text("\n{\n  title: \"Route Object - Options\",\n}");
    			t164 = space();
    			hr12 = element("hr");
    			t165 = space();
    			h413 = element("h4");
    			h413.textContent = "Ignore Global Before Function";
    			t167 = space();
    			p13 = element("p");
    			t168 = text("The ");
    			b34 = element("b");
    			b34.textContent = "ignoreGlobalBeforeFunction";
    			t170 = text(" option when is true will not execute any\n    Global Before Enter functions for this specific route.");
    			t171 = space();
    			pre12 = element("pre");
    			b35 = element("b");
    			b35.textContent = "// ## Ignore Global Before Function - \n// ## if should ignore defined global before function \n// ## Boolean\n// ## Default value: false";
    			t173 = text("\n{\n  ignoreGlobalBeforeFunction: false,\n}");
    			t174 = space();
    			hr13 = element("hr");
    			t175 = space();
    			h414 = element("h4");
    			h414.textContent = "Execute Route BEF Before Global BEF";
    			t177 = space();
    			p14 = element("p");
    			t178 = text("The ");
    			b36 = element("b");
    			b36.textContent = "executeRouteBEFBeforeGlobalBEF";
    			t180 = text(" option when is true will modify\n    the default behaviour of the SCR. The SCR always runs Global Before Enter\n    Functions before Route Before Enter Functions, but is different when this\n    option is true.\n    ");
    			br21 = element("br");
    			t181 = text("\n    When set to true it will execute Route Before Functions before Global Before\n    Functions.");
    			t182 = space();
    			pre13 = element("pre");
    			b37 = element("b");
    			b37.textContent = "// ## Execute Route Before Enter Function Before Global Before Function \n// ## if should execute route before function sequence before \n// ## global before enter execution\n// ## Boolean \n// ## Default value: false";
    			t184 = text("\n{\n  executeRouteBEFBeforeGlobalBEF: false,\n}");
    			t185 = space();
    			hr14 = element("hr");
    			t186 = space();
    			h415 = element("h4");
    			h415.textContent = "Force Reload";
    			t188 = space();
    			p15 = element("p");
    			t189 = text("The ");
    			b38 = element("b");
    			b38.textContent = "forceReload";
    			t191 = text(" option when is true will not reload the route when\n    the route is already loaded. The user may click in a button that pushes to\n    the current route. The default behaviour is just not to reload the route.\n    ");
    			br22 = element("br");
    			t192 = space();
    			br23 = element("br");
    			t193 = text("\n    But maybe this is a feature you want to execute.");
    			t194 = space();
    			pre14 = element("pre");
    			b39 = element("b");
    			b39.textContent = "// ## Force Reload - when in opened route try to push the same route\n// by using pushRoute function\n// When enabled it will reload the current route as if it was not opened\n// ## Boolean\n// ## Default value: false";
    			t196 = text("\n{\n  forceReload: false,\n}");
    			t197 = space();
    			p16 = element("p");
    			p16.textContent = "So that is it for this section. But it is not the end of the Route Options.\n    See the next section to more info.";
    			t199 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t201 = space();
    			pre15 = element("pre");
    			pre15.textContent = "{\n    name: \"routeObjectOptionsRoute\",\n    path: \"/svelte-client-router/routeObjectOptions\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_RouteObjectProperties.svelte\"),\n    title: \"SCR - Route Object - Options\",\n}";
    			t203 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$a, 6, 2, 180);
    			add_location(br0, file$a, 10, 4, 372);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$a, 7, 2, 232);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$a, 15, 2, 589);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$a, 16, 2, 613);
    			add_location(b0, file$a, 18, 8, 681);
    			add_location(br1, file$a, 20, 4, 774);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$a, 17, 2, 644);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$a, 27, 0, 994);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$a, 25, 2, 968);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$a, 39, 2, 1357);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$a, 40, 2, 1381);
    			add_location(b2, file$a, 42, 8, 1449);
    			add_location(br2, file$a, 43, 4, 1510);
    			add_location(br3, file$a, 44, 4, 1521);
    			add_location(br4, file$a, 48, 4, 1710);
    			add_location(br5, file$a, 49, 4, 1721);
    			add_location(br6, file$a, 51, 4, 1796);
    			add_location(b3, file$a, 52, 4, 1807);
    			add_location(br7, file$a, 53, 4, 1865);
    			add_location(br8, file$a, 54, 4, 1876);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$a, 41, 2, 1412);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$a, 59, 0, 2015);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$a, 70, 2, 2289);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$a, 76, 2, 2473);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$a, 57, 2, 1989);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$a, 86, 2, 2792);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$a, 87, 2, 2816);
    			add_location(b7, file$a, 89, 8, 2889);
    			add_location(br9, file$a, 91, 4, 3021);
    			add_location(br10, file$a, 92, 4, 3032);
    			attr_dev(p3, "class", "scr-text-justify");
    			add_location(p3, file$a, 88, 2, 2852);
    			attr_dev(b8, "class", "scr-b");
    			add_location(b8, file$a, 98, 0, 3172);
    			attr_dev(b9, "class", "scr-b");
    			add_location(b9, file$a, 105, 0, 3356);
    			attr_dev(b10, "class", "scr-b");
    			add_location(b10, file$a, 109, 2, 3465);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$a, 96, 2, 3146);
    			attr_dev(hr3, "class", "scr-hr");
    			add_location(hr3, file$a, 115, 2, 3733);
    			attr_dev(h44, "class", "scr-h4");
    			add_location(h44, file$a, 116, 2, 3757);
    			add_location(b11, file$a, 118, 8, 3840);
    			add_location(br11, file$a, 120, 4, 3974);
    			add_location(br12, file$a, 121, 4, 3985);
    			attr_dev(p4, "class", "scr-text-justify");
    			add_location(p4, file$a, 117, 2, 3803);
    			attr_dev(b12, "class", "scr-b");
    			add_location(b12, file$a, 127, 0, 4125);
    			attr_dev(b13, "class", "scr-b");
    			add_location(b13, file$a, 135, 2, 4342);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$a, 125, 2, 4099);
    			attr_dev(hr4, "class", "scr-hr");
    			add_location(hr4, file$a, 141, 2, 4665);
    			attr_dev(h45, "class", "scr-h4");
    			add_location(h45, file$a, 142, 2, 4689);
    			add_location(b14, file$a, 144, 8, 4769);
    			add_location(br13, file$a, 147, 4, 4932);
    			add_location(br14, file$a, 148, 4, 4943);
    			attr_dev(p5, "class", "scr-text-justify");
    			add_location(p5, file$a, 143, 2, 4732);
    			attr_dev(b15, "class", "scr-b");
    			add_location(b15, file$a, 154, 0, 5086);
    			attr_dev(b16, "class", "scr-b");
    			add_location(b16, file$a, 161, 0, 5287);
    			attr_dev(b17, "class", "scr-b");
    			add_location(b17, file$a, 165, 2, 5404);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$a, 152, 2, 5060);
    			attr_dev(hr5, "class", "scr-hr");
    			add_location(hr5, file$a, 171, 2, 5691);
    			attr_dev(h46, "class", "scr-h4");
    			add_location(h46, file$a, 172, 2, 5715);
    			add_location(b18, file$a, 174, 8, 5805);
    			add_location(br15, file$a, 177, 4, 5982);
    			add_location(br16, file$a, 178, 4, 5993);
    			attr_dev(p6, "class", "scr-text-justify");
    			add_location(p6, file$a, 173, 2, 5768);
    			attr_dev(b19, "class", "scr-b");
    			add_location(b19, file$a, 184, 0, 6141);
    			attr_dev(b20, "class", "scr-b");
    			add_location(b20, file$a, 192, 2, 6379);
    			attr_dev(pre5, "class", "scr-pre");
    			add_location(pre5, file$a, 182, 2, 6115);
    			attr_dev(hr6, "class", "scr-hr");
    			add_location(hr6, file$a, 198, 2, 6719);
    			attr_dev(h47, "class", "scr-h4");
    			add_location(h47, file$a, 199, 2, 6743);
    			add_location(b21, file$a, 201, 8, 6813);
    			add_location(br17, file$a, 203, 4, 6928);
    			attr_dev(p7, "class", "scr-text-justify");
    			add_location(p7, file$a, 200, 2, 6776);
    			attr_dev(b22, "class", "scr-b");
    			add_location(b22, file$a, 210, 0, 7160);
    			attr_dev(pre6, "class", "scr-pre");
    			add_location(pre6, file$a, 208, 2, 7134);
    			attr_dev(hr7, "class", "scr-hr");
    			add_location(hr7, file$a, 225, 2, 7632);
    			attr_dev(h48, "class", "scr-h4");
    			add_location(h48, file$a, 226, 2, 7656);
    			add_location(b23, file$a, 228, 8, 7733);
    			add_location(br18, file$a, 230, 4, 7826);
    			add_location(br19, file$a, 234, 4, 8030);
    			add_location(br20, file$a, 235, 4, 8041);
    			attr_dev(p8, "class", "scr-text-justify");
    			add_location(p8, file$a, 227, 2, 7696);
    			attr_dev(b24, "class", "scr-b");
    			add_location(b24, file$a, 240, 0, 8155);
    			attr_dev(pre7, "class", "scr-pre");
    			add_location(pre7, file$a, 238, 2, 8129);
    			attr_dev(hr8, "class", "scr-hr");
    			add_location(hr8, file$a, 252, 2, 8588);
    			attr_dev(h49, "class", "scr-h4");
    			add_location(h49, file$a, 253, 2, 8612);
    			add_location(b25, file$a, 255, 8, 8689);
    			attr_dev(p9, "class", "scr-text-justify");
    			add_location(p9, file$a, 254, 2, 8652);
    			attr_dev(b26, "class", "scr-b");
    			add_location(b26, file$a, 260, 0, 8824);
    			attr_dev(pre8, "class", "scr-pre");
    			add_location(pre8, file$a, 258, 2, 8798);
    			attr_dev(hr9, "class", "scr-hr");
    			add_location(hr9, file$a, 272, 2, 9237);
    			attr_dev(h410, "class", "scr-h4");
    			add_location(h410, file$a, 273, 2, 9261);
    			add_location(b27, file$a, 275, 8, 9338);
    			attr_dev(p10, "class", "scr-text-justify");
    			add_location(p10, file$a, 274, 2, 9301);
    			attr_dev(b28, "class", "scr-b");
    			add_location(b28, file$a, 280, 0, 9460);
    			attr_dev(pre9, "class", "scr-pre");
    			add_location(pre9, file$a, 278, 2, 9434);
    			attr_dev(hr10, "class", "scr-hr");
    			add_location(hr10, file$a, 291, 2, 9810);
    			attr_dev(h411, "class", "scr-h4");
    			add_location(h411, file$a, 292, 2, 9834);
    			add_location(b29, file$a, 294, 8, 9910);
    			add_location(b30, file$a, 294, 54, 9956);
    			attr_dev(p11, "class", "scr-text-justify");
    			add_location(p11, file$a, 293, 2, 9873);
    			attr_dev(b31, "class", "scr-b");
    			add_location(b31, file$a, 299, 0, 10053);
    			attr_dev(pre10, "class", "scr-pre");
    			add_location(pre10, file$a, 297, 2, 10027);
    			attr_dev(hr11, "class", "scr-hr");
    			add_location(hr11, file$a, 317, 2, 10580);
    			attr_dev(h412, "class", "scr-h4");
    			add_location(h412, file$a, 318, 2, 10604);
    			add_location(b32, file$a, 320, 8, 10673);
    			attr_dev(p12, "class", "scr-text-justify");
    			add_location(p12, file$a, 319, 2, 10636);
    			attr_dev(b33, "class", "scr-b");
    			add_location(b33, file$a, 324, 0, 10771);
    			attr_dev(pre11, "class", "scr-pre");
    			add_location(pre11, file$a, 322, 2, 10745);
    			attr_dev(hr12, "class", "scr-hr");
    			add_location(hr12, file$a, 335, 2, 11112);
    			attr_dev(h413, "class", "scr-h4");
    			add_location(h413, file$a, 336, 2, 11136);
    			add_location(b34, file$a, 338, 8, 11229);
    			attr_dev(p13, "class", "scr-text-justify");
    			add_location(p13, file$a, 337, 2, 11192);
    			attr_dev(b35, "class", "scr-b");
    			add_location(b35, file$a, 343, 0, 11398);
    			attr_dev(pre12, "class", "scr-pre");
    			add_location(pre12, file$a, 341, 2, 11372);
    			attr_dev(hr13, "class", "scr-hr");
    			add_location(hr13, file$a, 355, 2, 11796);
    			attr_dev(h414, "class", "scr-h4");
    			add_location(h414, file$a, 356, 2, 11820);
    			add_location(b36, file$a, 358, 8, 11919);
    			add_location(br21, file$a, 362, 4, 12169);
    			attr_dev(p14, "class", "scr-text-justify");
    			add_location(p14, file$a, 357, 2, 11882);
    			attr_dev(b37, "class", "scr-b");
    			add_location(b37, file$a, 368, 0, 12307);
    			attr_dev(pre13, "class", "scr-pre");
    			add_location(pre13, file$a, 366, 2, 12281);
    			attr_dev(hr14, "class", "scr-hr");
    			add_location(hr14, file$a, 381, 2, 12788);
    			attr_dev(h415, "class", "scr-h4");
    			add_location(h415, file$a, 382, 2, 12812);
    			add_location(b38, file$a, 384, 8, 12888);
    			add_location(br22, file$a, 387, 4, 13119);
    			add_location(br23, file$a, 388, 4, 13130);
    			attr_dev(p15, "class", "scr-text-justify");
    			add_location(p15, file$a, 383, 2, 12851);
    			attr_dev(b39, "class", "scr-b");
    			add_location(b39, file$a, 393, 0, 13225);
    			attr_dev(pre14, "class", "scr-pre");
    			add_location(pre14, file$a, 391, 2, 13199);
    			attr_dev(p16, "class", "scr-text-justify");
    			add_location(p16, file$a, 404, 2, 13507);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$a, 409, 4, 13696);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$a, 408, 2, 13664);
    			attr_dev(pre15, "class", "scr-pre");
    			add_location(pre15, file$a, 411, 2, 13777);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$a, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, br0);
    			append_dev(p0, t3);
    			append_dev(div, t4);
    			append_dev(div, hr0);
    			append_dev(div, t5);
    			append_dev(div, h41);
    			append_dev(div, t7);
    			append_dev(div, p1);
    			append_dev(p1, t8);
    			append_dev(p1, b0);
    			append_dev(p1, t10);
    			append_dev(p1, br1);
    			append_dev(p1, t11);
    			append_dev(div, t12);
    			append_dev(div, pre0);
    			append_dev(pre0, b1);
    			append_dev(pre0, t14);
    			append_dev(div, t15);
    			append_dev(div, hr1);
    			append_dev(div, t16);
    			append_dev(div, h42);
    			append_dev(div, t18);
    			append_dev(div, p2);
    			append_dev(p2, t19);
    			append_dev(p2, b2);
    			append_dev(p2, t21);
    			append_dev(p2, br2);
    			append_dev(p2, t22);
    			append_dev(p2, br3);
    			append_dev(p2, t23);
    			append_dev(p2, br4);
    			append_dev(p2, t24);
    			append_dev(p2, br5);
    			append_dev(p2, t25);
    			append_dev(p2, br6);
    			append_dev(p2, t26);
    			append_dev(p2, b3);
    			append_dev(p2, t28);
    			append_dev(p2, br7);
    			append_dev(p2, t29);
    			append_dev(p2, br8);
    			append_dev(p2, t30);
    			append_dev(div, t31);
    			append_dev(div, pre1);
    			append_dev(pre1, b4);
    			append_dev(pre1, t33);
    			append_dev(pre1, b5);
    			append_dev(pre1, t35);
    			append_dev(pre1, b6);
    			append_dev(pre1, t37);
    			append_dev(div, t38);
    			append_dev(div, hr2);
    			append_dev(div, t39);
    			append_dev(div, h43);
    			append_dev(div, t41);
    			append_dev(div, p3);
    			append_dev(p3, t42);
    			append_dev(p3, b7);
    			append_dev(p3, t44);
    			append_dev(p3, br9);
    			append_dev(p3, t45);
    			append_dev(p3, br10);
    			append_dev(p3, t46);
    			append_dev(div, t47);
    			append_dev(div, pre2);
    			append_dev(pre2, b8);
    			append_dev(pre2, t49);
    			append_dev(pre2, b9);
    			append_dev(pre2, t51);
    			append_dev(pre2, b10);
    			append_dev(pre2, t53);
    			append_dev(div, t54);
    			append_dev(div, hr3);
    			append_dev(div, t55);
    			append_dev(div, h44);
    			append_dev(div, t57);
    			append_dev(div, p4);
    			append_dev(p4, t58);
    			append_dev(p4, b11);
    			append_dev(p4, t60);
    			append_dev(p4, br11);
    			append_dev(p4, t61);
    			append_dev(p4, br12);
    			append_dev(p4, t62);
    			append_dev(div, t63);
    			append_dev(div, pre3);
    			append_dev(pre3, b12);
    			append_dev(pre3, t65);
    			append_dev(pre3, b13);
    			append_dev(pre3, t67);
    			append_dev(div, t68);
    			append_dev(div, hr4);
    			append_dev(div, t69);
    			append_dev(div, h45);
    			append_dev(div, t71);
    			append_dev(div, p5);
    			append_dev(p5, t72);
    			append_dev(p5, b14);
    			append_dev(p5, t74);
    			append_dev(p5, br13);
    			append_dev(p5, t75);
    			append_dev(p5, br14);
    			append_dev(p5, t76);
    			append_dev(div, t77);
    			append_dev(div, pre4);
    			append_dev(pre4, b15);
    			append_dev(pre4, t79);
    			append_dev(pre4, b16);
    			append_dev(pre4, t81);
    			append_dev(pre4, b17);
    			append_dev(pre4, t83);
    			append_dev(div, t84);
    			append_dev(div, hr5);
    			append_dev(div, t85);
    			append_dev(div, h46);
    			append_dev(div, t87);
    			append_dev(div, p6);
    			append_dev(p6, t88);
    			append_dev(p6, b18);
    			append_dev(p6, t90);
    			append_dev(p6, br15);
    			append_dev(p6, t91);
    			append_dev(p6, br16);
    			append_dev(p6, t92);
    			append_dev(div, t93);
    			append_dev(div, pre5);
    			append_dev(pre5, b19);
    			append_dev(pre5, t95);
    			append_dev(pre5, b20);
    			append_dev(pre5, t97);
    			append_dev(div, t98);
    			append_dev(div, hr6);
    			append_dev(div, t99);
    			append_dev(div, h47);
    			append_dev(div, t101);
    			append_dev(div, p7);
    			append_dev(p7, t102);
    			append_dev(p7, b21);
    			append_dev(p7, t104);
    			append_dev(p7, br17);
    			append_dev(p7, t105);
    			append_dev(div, t106);
    			append_dev(div, pre6);
    			append_dev(pre6, b22);
    			append_dev(pre6, t108);
    			append_dev(div, t109);
    			append_dev(div, hr7);
    			append_dev(div, t110);
    			append_dev(div, h48);
    			append_dev(div, t112);
    			append_dev(div, p8);
    			append_dev(p8, t113);
    			append_dev(p8, b23);
    			append_dev(p8, t115);
    			append_dev(p8, br18);
    			append_dev(p8, t116);
    			append_dev(p8, br19);
    			append_dev(p8, t117);
    			append_dev(p8, br20);
    			append_dev(p8, t118);
    			append_dev(div, t119);
    			append_dev(div, pre7);
    			append_dev(pre7, b24);
    			append_dev(pre7, t121);
    			append_dev(div, t122);
    			append_dev(div, hr8);
    			append_dev(div, t123);
    			append_dev(div, h49);
    			append_dev(div, t125);
    			append_dev(div, p9);
    			append_dev(p9, t126);
    			append_dev(p9, b25);
    			append_dev(p9, t128);
    			append_dev(div, t129);
    			append_dev(div, pre8);
    			append_dev(pre8, b26);
    			append_dev(pre8, t131);
    			append_dev(div, t132);
    			append_dev(div, hr9);
    			append_dev(div, t133);
    			append_dev(div, h410);
    			append_dev(div, t135);
    			append_dev(div, p10);
    			append_dev(p10, t136);
    			append_dev(p10, b27);
    			append_dev(p10, t138);
    			append_dev(div, t139);
    			append_dev(div, pre9);
    			append_dev(pre9, b28);
    			append_dev(pre9, t141);
    			append_dev(div, t142);
    			append_dev(div, hr10);
    			append_dev(div, t143);
    			append_dev(div, h411);
    			append_dev(div, t145);
    			append_dev(div, p11);
    			append_dev(p11, t146);
    			append_dev(p11, b29);
    			append_dev(p11, t148);
    			append_dev(p11, b30);
    			append_dev(p11, t150);
    			append_dev(div, t151);
    			append_dev(div, pre10);
    			append_dev(pre10, b31);
    			append_dev(pre10, t153);
    			append_dev(div, t154);
    			append_dev(div, hr11);
    			append_dev(div, t155);
    			append_dev(div, h412);
    			append_dev(div, t157);
    			append_dev(div, p12);
    			append_dev(p12, t158);
    			append_dev(p12, b32);
    			append_dev(p12, t160);
    			append_dev(div, t161);
    			append_dev(div, pre11);
    			append_dev(pre11, b33);
    			append_dev(pre11, t163);
    			append_dev(div, t164);
    			append_dev(div, hr12);
    			append_dev(div, t165);
    			append_dev(div, h413);
    			append_dev(div, t167);
    			append_dev(div, p13);
    			append_dev(p13, t168);
    			append_dev(p13, b34);
    			append_dev(p13, t170);
    			append_dev(div, t171);
    			append_dev(div, pre12);
    			append_dev(pre12, b35);
    			append_dev(pre12, t173);
    			append_dev(div, t174);
    			append_dev(div, hr13);
    			append_dev(div, t175);
    			append_dev(div, h414);
    			append_dev(div, t177);
    			append_dev(div, p14);
    			append_dev(p14, t178);
    			append_dev(p14, b36);
    			append_dev(p14, t180);
    			append_dev(p14, br21);
    			append_dev(p14, t181);
    			append_dev(div, t182);
    			append_dev(div, pre13);
    			append_dev(pre13, b37);
    			append_dev(pre13, t184);
    			append_dev(div, t185);
    			append_dev(div, hr14);
    			append_dev(div, t186);
    			append_dev(div, h415);
    			append_dev(div, t188);
    			append_dev(div, p15);
    			append_dev(p15, t189);
    			append_dev(p15, b38);
    			append_dev(p15, t191);
    			append_dev(p15, br22);
    			append_dev(p15, t192);
    			append_dev(p15, br23);
    			append_dev(p15, t193);
    			append_dev(div, t194);
    			append_dev(div, pre14);
    			append_dev(pre14, b39);
    			append_dev(pre14, t196);
    			append_dev(div, t197);
    			append_dev(div, p16);
    			append_dev(div, t199);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t201);
    			append_dev(div, pre15);
    			append_dev(div, t203);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_RouteObjectProperties", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouteObjectProperties> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_RouteObjectProperties extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteObjectProperties",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    var SCR_RouteObjectProperties$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteObjectProperties
    });

    /* src/docs/pages/SCR_RouteObjectBeforeEnter.svelte generated by Svelte v3.37.0 */
    const file$9 = "src/docs/pages/SCR_RouteObjectBeforeEnter.svelte";

    // (29:12) <SCR_ROUTER_LINK       to={{ name: "routeObjectOptionsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$3(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Route Object Properties";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$9, 32, 6, 1468);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(29:12) <SCR_ROUTER_LINK       to={{ name: \\\"routeObjectOptionsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (73:2) <SCR_PageFooter>
    function create_default_slot$9(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "routeObjectOptionsRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "routeObjectAfterBeforeEnterRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$9, 74, 6, 2803);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$9, 73, 4, 2779);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(73:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let p;
    	let t2;
    	let b0;
    	let t4;
    	let b1;
    	let t6;
    	let br0;
    	let t7;
    	let br1;
    	let t8;
    	let br2;
    	let t9;
    	let br3;
    	let t10;
    	let b2;
    	let t12;
    	let br4;
    	let t13;
    	let br5;
    	let t14;
    	let scr_router_link;
    	let t15;
    	let br6;
    	let t16;
    	let br7;
    	let t17;
    	let t18;
    	let pre0;
    	let b3;
    	let t20;
    	let b4;
    	let t22;
    	let b5;
    	let t24;
    	let b6;
    	let t26;
    	let b7;
    	let t28;
    	let b8;
    	let t30;
    	let t31;
    	let scr_beforeenterrouteanatomy;
    	let t32;
    	let center;
    	let small;
    	let t34;
    	let pre1;
    	let t36;
    	let scr_pagefooter;
    	let current;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectOptionsRoute" },
    				elementProps: {
    					style: "display: inline; cursor: pointer;"
    				},
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_beforeenterrouteanatomy = new SCR_BeforeEnterRouteAnatomy({ $$inline: true });

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Route Object - Before Enter Functions";
    			t1 = space();
    			p = element("p");
    			t2 = text("The ");
    			b0 = element("b");
    			b0.textContent = "beforeEnter";
    			t4 = text(" option sets an array of functions or just a function\n    that must be executed for before each route if the option\n    ");
    			b1 = element("b");
    			b1.textContent = "ignoreGlobalBeforeFunction";
    			t6 = text("\n    isn't set in the route definition object.\n    ");
    			br0 = element("br");
    			t7 = space();
    			br1 = element("br");
    			t8 = text("\n    The default order of execution is first execute all Global Before Functions and\n    then execute route object before enter functions. But for a particular route\n    the behaviour maybe different. Maybe it is needed to execute the route before\n    function before Global Before Functions.\n    ");
    			br2 = element("br");
    			t9 = space();
    			br3 = element("br");
    			t10 = text("\n    If that is the case then you can set in the route object the option\n    ");
    			b2 = element("b");
    			b2.textContent = "executeRouteBEFBeforeGlobalBEF";
    			t12 = text(" to true. When this option is enabled\n    in the route definition object the default order of execution is overrided\n    and executes route object before functions before Global Before Functions.\n    ");
    			br4 = element("br");
    			t13 = space();
    			br5 = element("br");
    			t14 = text("\n    See the ");
    			create_component(scr_router_link.$$.fragment);
    			t15 = text(" for more info.\n    ");
    			br6 = element("br");
    			t16 = space();
    			br7 = element("br");
    			t17 = text("\n    See the next example of how to set this option:");
    			t18 = space();
    			pre0 = element("pre");
    			b3 = element("b");
    			b3.textContent = "// ------ SETTING A FUNCTION ------";
    			t20 = text("\n");
    			b4 = element("b");
    			b4.textContent = "// Setting Route Before Enter Function";
    			t22 = text("\n{\n  beforeEnter((resolve) => { resolve(true); });\n}\n");
    			b5 = element("b");
    			b5.textContent = "// OR";
    			t24 = text("\n\n");
    			b6 = element("b");
    			b6.textContent = "// ------ SETTING AN ARRAY OF FUNCTIONS ------";
    			t26 = text("\n");
    			b7 = element("b");
    			b7.textContent = "// Setting Route Before Enter Functions";
    			t28 = text("\n");
    			b8 = element("b");
    			b8.textContent = "// You can set as many Before Enter Functions as you want!";
    			t30 = text("\n{\n  beforeEnter([\n    (resolve) => { resolve(true); },\n    (resolve) => { resolve(true); },\n    (resolve) => { resolve(true); },\n  ]);\n}");
    			t31 = space();
    			create_component(scr_beforeenterrouteanatomy.$$.fragment);
    			t32 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t34 = space();
    			pre1 = element("pre");
    			pre1.textContent = "{\n    name: \"routeObjectBeforeEnterRoute\",\n    path: \"/svelte-client-router/routeObjectBeforeEnter\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_RouteObjectBeforeEnter.svelte\"),\n    title: \"SCR - Route Object - Before Enter Functions\",\n}";
    			t36 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$9, 8, 2, 326);
    			add_location(b0, file$9, 10, 8, 427);
    			add_location(b1, file$9, 12, 4, 565);
    			add_location(br0, file$9, 14, 4, 649);
    			add_location(br1, file$9, 15, 4, 660);
    			add_location(br2, file$9, 20, 4, 963);
    			add_location(br3, file$9, 21, 4, 974);
    			add_location(b2, file$9, 23, 4, 1057);
    			add_location(br4, file$9, 26, 4, 1294);
    			add_location(br5, file$9, 27, 4, 1305);
    			add_location(br6, file$9, 34, 4, 1580);
    			add_location(br7, file$9, 35, 4, 1591);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$9, 9, 2, 390);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$9, 40, 0, 1685);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$9, 41, 0, 1743);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$9, 45, 0, 1878);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$9, 47, 0, 1907);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$9, 48, 0, 1976);
    			attr_dev(b8, "class", "scr-b");
    			add_location(b8, file$9, 49, 0, 2037);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$9, 38, 2, 1659);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$9, 61, 4, 2381);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$9, 60, 2, 2349);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$9, 63, 2, 2462);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$9, 7, 0, 301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(p, b0);
    			append_dev(p, t4);
    			append_dev(p, b1);
    			append_dev(p, t6);
    			append_dev(p, br0);
    			append_dev(p, t7);
    			append_dev(p, br1);
    			append_dev(p, t8);
    			append_dev(p, br2);
    			append_dev(p, t9);
    			append_dev(p, br3);
    			append_dev(p, t10);
    			append_dev(p, b2);
    			append_dev(p, t12);
    			append_dev(p, br4);
    			append_dev(p, t13);
    			append_dev(p, br5);
    			append_dev(p, t14);
    			mount_component(scr_router_link, p, null);
    			append_dev(p, t15);
    			append_dev(p, br6);
    			append_dev(p, t16);
    			append_dev(p, br7);
    			append_dev(p, t17);
    			append_dev(div, t18);
    			append_dev(div, pre0);
    			append_dev(pre0, b3);
    			append_dev(pre0, t20);
    			append_dev(pre0, b4);
    			append_dev(pre0, t22);
    			append_dev(pre0, b5);
    			append_dev(pre0, t24);
    			append_dev(pre0, b6);
    			append_dev(pre0, t26);
    			append_dev(pre0, b7);
    			append_dev(pre0, t28);
    			append_dev(pre0, b8);
    			append_dev(pre0, t30);
    			append_dev(div, t31);
    			mount_component(scr_beforeenterrouteanatomy, div, null);
    			append_dev(div, t32);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t34);
    			append_dev(div, pre1);
    			append_dev(div, t36);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_router_link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link.$set(scr_router_link_changes);
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_router_link.$$.fragment, local);
    			transition_in(scr_beforeenterrouteanatomy.$$.fragment, local);
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_link.$$.fragment, local);
    			transition_out(scr_beforeenterrouteanatomy.$$.fragment, local);
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_router_link);
    			destroy_component(scr_beforeenterrouteanatomy);
    			destroy_component(scr_pagefooter);
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

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_RouteObjectBeforeEnter", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouteObjectBeforeEnter> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton,
    		SCR_BeforeEnterRouteAnatomy
    	});

    	return [];
    }

    class SCR_RouteObjectBeforeEnter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteObjectBeforeEnter",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    var SCR_RouteObjectBeforeEnter$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteObjectBeforeEnter
    });

    /* src/docs/pages/SCR_RouteObjectAfterBeforeEnter.svelte generated by Svelte v3.37.0 */
    const file$8 = "src/docs/pages/SCR_RouteObjectAfterBeforeEnter.svelte";

    // (128:2) <SCR_PageFooter>
    function create_default_slot$8(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "routeObjectBeforeEnterRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "routeObjectOnErrorRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$8, 129, 6, 4687);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$8, 128, 4, 4663);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(128:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let h40;
    	let t1;
    	let p0;
    	let t2;
    	let b0;
    	let t4;
    	let br0;
    	let t5;
    	let br1;
    	let t6;
    	let br2;
    	let t7;
    	let br3;
    	let t8;
    	let t9;
    	let pre0;
    	let b1;
    	let t11;
    	let b2;
    	let t13;
    	let t14;
    	let hr;
    	let t15;
    	let h41;
    	let t17;
    	let p1;
    	let t18;
    	let br4;
    	let t19;
    	let t20;
    	let pre1;
    	let b3;
    	let t22;
    	let t23;
    	let ul3;
    	let li19;
    	let b4;
    	let t25;
    	let br5;
    	let t26;
    	let ul2;
    	let li8;
    	let b5;
    	let t28;
    	let ul0;
    	let li0;
    	let b6;
    	let t30;
    	let t31;
    	let li1;
    	let b7;
    	let t33;
    	let t34;
    	let li2;
    	let b8;
    	let t36;
    	let t37;
    	let li3;
    	let b9;
    	let t39;
    	let t40;
    	let li4;
    	let b10;
    	let t42;
    	let t43;
    	let li5;
    	let b11;
    	let t45;
    	let t46;
    	let li6;
    	let b12;
    	let t48;
    	let t49;
    	let li7;
    	let b13;
    	let t51;
    	let t52;
    	let br6;
    	let t53;
    	let li17;
    	let b14;
    	let t55;
    	let ul1;
    	let li9;
    	let b15;
    	let t57;
    	let t58;
    	let li10;
    	let b16;
    	let t60;
    	let t61;
    	let li11;
    	let b17;
    	let t63;
    	let t64;
    	let li12;
    	let b18;
    	let t66;
    	let t67;
    	let li13;
    	let b19;
    	let t69;
    	let t70;
    	let li14;
    	let b20;
    	let t72;
    	let t73;
    	let li15;
    	let b21;
    	let t75;
    	let t76;
    	let li16;
    	let b22;
    	let t78;
    	let t79;
    	let br7;
    	let t80;
    	let li18;
    	let b23;
    	let t82;
    	let t83;
    	let center;
    	let small;
    	let t85;
    	let pre2;
    	let t87;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			h40.textContent = "Route Object - After Before Enter Function";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("The ");
    			b0 = element("b");
    			b0.textContent = "afterEnter";
    			t4 = text(" option sets a function that must be executed for this\n    specific route when finishing routing. This function will not redirect or\n    avoid entering the route. The permission to enter has been granted already\n    by passing all the before enter functions.\n    ");
    			br0 = element("br");
    			t5 = space();
    			br1 = element("br");
    			t6 = text("\n    So this function is more like a customization before enter. Here you can override\n    the title of the route, can pass more parameters or execute important stuff before\n    render the route.\n    ");
    			br2 = element("br");
    			t7 = space();
    			br3 = element("br");
    			t8 = text("\n    See the next example of how to set this option:");
    			t9 = space();
    			pre0 = element("pre");
    			b1 = element("b");
    			b1.textContent = "// ------ SETTING A FUNCTION ------";
    			t11 = text("\n");
    			b2 = element("b");
    			b2.textContent = "// Setting Route After Enter Function";
    			t13 = text("\n{\n  afterEnter((routeObjParams) => { console.log(routeObjParams); });\n}");
    			t14 = space();
    			hr = element("hr");
    			t15 = space();
    			h41 = element("h4");
    			h41.textContent = "Anatomy of the After Before Enter Function";
    			t17 = space();
    			p1 = element("p");
    			t18 = text("When declaring a After Before Enter Function it will be provided a\n    parameter.\n    ");
    			br4 = element("br");
    			t19 = text("\n    Lets check it:");
    			t20 = space();
    			pre1 = element("pre");
    			b3 = element("b");
    			b3.textContent = "// Example of After Before Enter Function declaration";
    			t22 = text("\n(routeObjParams) => { \n  console.log(routeObjParams);\n}");
    			t23 = space();
    			ul3 = element("ul");
    			li19 = element("li");
    			b4 = element("b");
    			b4.textContent = "routeObjParams: ";
    			t25 = text("All the parameters passed until that error has\n      occurred.\n      ");
    			br5 = element("br");
    			t26 = text("\n      This is a composed object and it has the following parameters:\n      ");
    			ul2 = element("ul");
    			li8 = element("li");
    			b5 = element("b");
    			b5.textContent = "currentRoute:";
    			t28 = text(" The current route object containing the\n          information of the route that the user is trying to access. It is\n          composed by the following params:\n          ");
    			ul0 = element("ul");
    			li0 = element("li");
    			b6 = element("b");
    			b6.textContent = "name: ";
    			t30 = text("The name of the route");
    			t31 = space();
    			li1 = element("li");
    			b7 = element("b");
    			b7.textContent = "hash: ";
    			t33 = text("The hash value of the route");
    			t34 = space();
    			li2 = element("li");
    			b8 = element("b");
    			b8.textContent = "hostname: ";
    			t36 = text("The hostname of the route. For example:\n              \"localhost\"");
    			t37 = space();
    			li3 = element("li");
    			b9 = element("b");
    			b9.textContent = "origin: ";
    			t39 = text("The origin of the route. For example:\n              \"http://localhost:5000\"");
    			t40 = space();
    			li4 = element("li");
    			b10 = element("b");
    			b10.textContent = "params: ";
    			t42 = text("The query params of the route. For example: {\n              testParam: \"someParamValue\" }");
    			t43 = space();
    			li5 = element("li");
    			b11 = element("b");
    			b11.textContent = "pathname: ";
    			t45 = text("The path of the route. For example:\n              \"/svelte-client-router/configurationBeforeEnter\"");
    			t46 = space();
    			li6 = element("li");
    			b12 = element("b");
    			b12.textContent = "port: ";
    			t48 = text("The port of the host. For example: \"5000\"");
    			t49 = space();
    			li7 = element("li");
    			b13 = element("b");
    			b13.textContent = "protocol: ";
    			t51 = text("The protocol used. For example: \"http:\"");
    			t52 = space();
    			br6 = element("br");
    			t53 = space();
    			li17 = element("li");
    			b14 = element("b");
    			b14.textContent = "fromRoute:";
    			t55 = text(" The coming from route object containing the\n          information of the route that the user is coming from. It is composed\n          by the following params:\n          ");
    			ul1 = element("ul");
    			li9 = element("li");
    			b15 = element("b");
    			b15.textContent = "name: ";
    			t57 = text("The name of the route");
    			t58 = space();
    			li10 = element("li");
    			b16 = element("b");
    			b16.textContent = "hash: ";
    			t60 = text("The hash value of the route");
    			t61 = space();
    			li11 = element("li");
    			b17 = element("b");
    			b17.textContent = "hostname: ";
    			t63 = text("The hostname of the route. For example:\n              \"localhost\"");
    			t64 = space();
    			li12 = element("li");
    			b18 = element("b");
    			b18.textContent = "origin: ";
    			t66 = text("The origin of the route. For example:\n              \"http://localhost:5000\"");
    			t67 = space();
    			li13 = element("li");
    			b19 = element("b");
    			b19.textContent = "params: ";
    			t69 = text("The query params of the route. For example: {\n              testParam: \"someParamValue\" }");
    			t70 = space();
    			li14 = element("li");
    			b20 = element("b");
    			b20.textContent = "pathname: ";
    			t72 = text("The path of the route. For example:\n              \"/svelte-client-router/configurationBeforeEnter\"");
    			t73 = space();
    			li15 = element("li");
    			b21 = element("b");
    			b21.textContent = "port: ";
    			t75 = text("The port of the host. For example: \"5000\"");
    			t76 = space();
    			li16 = element("li");
    			b22 = element("b");
    			b22.textContent = "protocol: ";
    			t78 = text("The protocol used. For example: \"http:\"");
    			t79 = space();
    			br7 = element("br");
    			t80 = space();
    			li18 = element("li");
    			b23 = element("b");
    			b23.textContent = "routeObjParams:";
    			t82 = text(" all the parameters passed down the before enter\n          chain and route parameters, that includes payload as well.");
    			t83 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t85 = space();
    			pre2 = element("pre");
    			pre2.textContent = "{\n    name: \"routeObjectAfterBeforeEnterRoute\",\n    path: \"/svelte-client-router/routeObjectAfterBeforeEnter\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_RouteObjectAfterBeforeEnter.svelte\"),\n    title: \"SCR - Route Object - After Before Function\",\n}";
    			t87 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$8, 6, 2, 180);
    			add_location(b0, file$8, 8, 8, 286);
    			add_location(br0, file$8, 12, 4, 566);
    			add_location(br1, file$8, 13, 4, 577);
    			add_location(br2, file$8, 17, 4, 783);
    			add_location(br3, file$8, 18, 4, 794);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$8, 7, 2, 249);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$8, 23, 0, 888);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$8, 24, 0, 946);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$8, 21, 2, 862);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$8, 29, 2, 1111);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$8, 30, 2, 1135);
    			add_location(br4, file$8, 34, 4, 1323);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$8, 31, 2, 1204);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$8, 39, 0, 1384);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$8, 37, 2, 1358);
    			add_location(b4, file$8, 46, 6, 1559);
    			add_location(br5, file$8, 48, 6, 1651);
    			add_location(b5, file$8, 52, 10, 1761);
    			add_location(b6, file$8, 56, 16, 1974);
    			add_location(li0, file$8, 56, 12, 1970);
    			add_location(b7, file$8, 57, 16, 2030);
    			add_location(li1, file$8, 57, 12, 2026);
    			add_location(b8, file$8, 59, 14, 2107);
    			add_location(li2, file$8, 58, 12, 2088);
    			add_location(b9, file$8, 63, 14, 2239);
    			add_location(li3, file$8, 62, 12, 2220);
    			add_location(b10, file$8, 67, 14, 2379);
    			add_location(li4, file$8, 66, 12, 2360);
    			add_location(b11, file$8, 71, 14, 2542);
    			add_location(li5, file$8, 70, 12, 2523);
    			add_location(b12, file$8, 74, 16, 2692);
    			add_location(li6, file$8, 74, 12, 2688);
    			add_location(b13, file$8, 75, 16, 2768);
    			add_location(li7, file$8, 75, 12, 2764);
    			add_location(ul0, file$8, 55, 10, 1953);
    			add_location(li8, file$8, 51, 8, 1746);
    			add_location(br6, file$8, 78, 8, 2868);
    			add_location(b14, file$8, 80, 10, 2898);
    			add_location(b15, file$8, 84, 16, 3107);
    			add_location(li9, file$8, 84, 12, 3103);
    			add_location(b16, file$8, 85, 16, 3163);
    			add_location(li10, file$8, 85, 12, 3159);
    			add_location(b17, file$8, 87, 14, 3240);
    			add_location(li11, file$8, 86, 12, 3221);
    			add_location(b18, file$8, 91, 14, 3372);
    			add_location(li12, file$8, 90, 12, 3353);
    			add_location(b19, file$8, 95, 14, 3512);
    			add_location(li13, file$8, 94, 12, 3493);
    			add_location(b20, file$8, 99, 14, 3675);
    			add_location(li14, file$8, 98, 12, 3656);
    			add_location(b21, file$8, 102, 16, 3825);
    			add_location(li15, file$8, 102, 12, 3821);
    			add_location(b22, file$8, 103, 16, 3901);
    			add_location(li16, file$8, 103, 12, 3897);
    			add_location(ul1, file$8, 83, 10, 3086);
    			add_location(li17, file$8, 79, 8, 2883);
    			add_location(br7, file$8, 106, 8, 4001);
    			add_location(b23, file$8, 108, 10, 4031);
    			add_location(li18, file$8, 107, 8, 4016);
    			add_location(ul2, file$8, 50, 6, 1733);
    			add_location(li19, file$8, 45, 4, 1548);
    			add_location(ul3, file$8, 44, 2, 1539);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$8, 116, 4, 4251);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$8, 115, 2, 4219);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$8, 118, 2, 4332);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$8, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, b0);
    			append_dev(p0, t4);
    			append_dev(p0, br0);
    			append_dev(p0, t5);
    			append_dev(p0, br1);
    			append_dev(p0, t6);
    			append_dev(p0, br2);
    			append_dev(p0, t7);
    			append_dev(p0, br3);
    			append_dev(p0, t8);
    			append_dev(div, t9);
    			append_dev(div, pre0);
    			append_dev(pre0, b1);
    			append_dev(pre0, t11);
    			append_dev(pre0, b2);
    			append_dev(pre0, t13);
    			append_dev(div, t14);
    			append_dev(div, hr);
    			append_dev(div, t15);
    			append_dev(div, h41);
    			append_dev(div, t17);
    			append_dev(div, p1);
    			append_dev(p1, t18);
    			append_dev(p1, br4);
    			append_dev(p1, t19);
    			append_dev(div, t20);
    			append_dev(div, pre1);
    			append_dev(pre1, b3);
    			append_dev(pre1, t22);
    			append_dev(div, t23);
    			append_dev(div, ul3);
    			append_dev(ul3, li19);
    			append_dev(li19, b4);
    			append_dev(li19, t25);
    			append_dev(li19, br5);
    			append_dev(li19, t26);
    			append_dev(li19, ul2);
    			append_dev(ul2, li8);
    			append_dev(li8, b5);
    			append_dev(li8, t28);
    			append_dev(li8, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, b6);
    			append_dev(li0, t30);
    			append_dev(ul0, t31);
    			append_dev(ul0, li1);
    			append_dev(li1, b7);
    			append_dev(li1, t33);
    			append_dev(ul0, t34);
    			append_dev(ul0, li2);
    			append_dev(li2, b8);
    			append_dev(li2, t36);
    			append_dev(ul0, t37);
    			append_dev(ul0, li3);
    			append_dev(li3, b9);
    			append_dev(li3, t39);
    			append_dev(ul0, t40);
    			append_dev(ul0, li4);
    			append_dev(li4, b10);
    			append_dev(li4, t42);
    			append_dev(ul0, t43);
    			append_dev(ul0, li5);
    			append_dev(li5, b11);
    			append_dev(li5, t45);
    			append_dev(ul0, t46);
    			append_dev(ul0, li6);
    			append_dev(li6, b12);
    			append_dev(li6, t48);
    			append_dev(ul0, t49);
    			append_dev(ul0, li7);
    			append_dev(li7, b13);
    			append_dev(li7, t51);
    			append_dev(ul2, t52);
    			append_dev(ul2, br6);
    			append_dev(ul2, t53);
    			append_dev(ul2, li17);
    			append_dev(li17, b14);
    			append_dev(li17, t55);
    			append_dev(li17, ul1);
    			append_dev(ul1, li9);
    			append_dev(li9, b15);
    			append_dev(li9, t57);
    			append_dev(ul1, t58);
    			append_dev(ul1, li10);
    			append_dev(li10, b16);
    			append_dev(li10, t60);
    			append_dev(ul1, t61);
    			append_dev(ul1, li11);
    			append_dev(li11, b17);
    			append_dev(li11, t63);
    			append_dev(ul1, t64);
    			append_dev(ul1, li12);
    			append_dev(li12, b18);
    			append_dev(li12, t66);
    			append_dev(ul1, t67);
    			append_dev(ul1, li13);
    			append_dev(li13, b19);
    			append_dev(li13, t69);
    			append_dev(ul1, t70);
    			append_dev(ul1, li14);
    			append_dev(li14, b20);
    			append_dev(li14, t72);
    			append_dev(ul1, t73);
    			append_dev(ul1, li15);
    			append_dev(li15, b21);
    			append_dev(li15, t75);
    			append_dev(ul1, t76);
    			append_dev(ul1, li16);
    			append_dev(li16, b22);
    			append_dev(li16, t78);
    			append_dev(ul2, t79);
    			append_dev(ul2, br7);
    			append_dev(ul2, t80);
    			append_dev(ul2, li18);
    			append_dev(li18, b23);
    			append_dev(li18, t82);
    			append_dev(div, t83);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t85);
    			append_dev(div, pre2);
    			append_dev(div, t87);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_RouteObjectAfterBeforeEnter", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouteObjectAfterBeforeEnter> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_RouteObjectAfterBeforeEnter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteObjectAfterBeforeEnter",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    var SCR_RouteObjectAfterBeforeEnter$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteObjectAfterBeforeEnter
    });

    /* src/docs/pages/SCR_RouteObjectOnError.svelte generated by Svelte v3.37.0 */
    const file$7 = "src/docs/pages/SCR_RouteObjectOnError.svelte";

    // (19:12) <SCR_ROUTER_LINK       to={{ name: "routeComponentComponentsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$2(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Route Component Components";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$7, 22, 6, 949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(19:12) <SCR_ROUTER_LINK       to={{ name: \\\"routeComponentComponentsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (53:2) <SCR_PageFooter>
    function create_default_slot$7(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "routeObjectAfterEnterRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "routeComponentPropertiesRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$7, 54, 6, 1899);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$7, 53, 4, 1875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(53:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let p0;
    	let t2;
    	let b0;
    	let t4;
    	let br0;
    	let t5;
    	let br1;
    	let t6;
    	let br2;
    	let t7;
    	let scr_router_link;
    	let t8;
    	let t9;
    	let pre0;
    	let b1;
    	let t11;
    	let t12;
    	let br3;
    	let t13;
    	let scr_onerroranatomy;
    	let t14;
    	let p1;
    	let t16;
    	let center;
    	let small;
    	let t18;
    	let pre1;
    	let t20;
    	let scr_pagefooter;
    	let current;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeComponentComponentsRoute" },
    				elementProps: {
    					style: "display: inline; cursor: pointer;"
    				},
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_onerroranatomy = new SCR_OnErrorAnatomy({ $$inline: true });

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Route Object - On Error Function";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("The ");
    			b0 = element("b");
    			b0.textContent = "onError";
    			t4 = text(" option sets a function that is going to be executed for\n    the specific route when something goes wrong.\n    ");
    			br0 = element("br");
    			t5 = space();
    			br1 = element("br");
    			t6 = text("\n    When that happens the natural behaviour is to open the error page. In this context\n    SCR has a very basic error component that comes with it. You can of course set\n    you own error component and it is encouraged to do so.\n    ");
    			br2 = element("br");
    			t7 = text("\n    See the ");
    			create_component(scr_router_link.$$.fragment);
    			t8 = text(" for more info.");
    			t9 = space();
    			pre0 = element("pre");
    			b1 = element("b");
    			b1.textContent = "// Setting Route On Error Function";
    			t11 = text("\n}\n  onError((err, routeObjParams) => { console.error(err) });\n{");
    			t12 = space();
    			br3 = element("br");
    			t13 = space();
    			create_component(scr_onerroranatomy.$$.fragment);
    			t14 = space();
    			p1 = element("p");
    			p1.textContent = "So that is it for this section. This feature enables us to handle any errors\n    that may occur inside this specific route definition.";
    			t16 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t18 = space();
    			pre1 = element("pre");
    			pre1.textContent = "{\n    name: \"routeObjectOnErrorRoute\",\n    path: \"/svelte-client-router/routeObjectOnError\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_RouteObjectOnError.svelte\"),\n    title: \"SCR - Route Object - On Error Function\",\n}";
    			t20 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$7, 8, 2, 308);
    			add_location(b0, file$7, 10, 8, 404);
    			add_location(br0, file$7, 12, 4, 529);
    			add_location(br1, file$7, 13, 4, 540);
    			add_location(br2, file$7, 17, 4, 780);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$7, 9, 2, 367);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$7, 28, 0, 1096);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$7, 25, 2, 1069);
    			add_location(br3, file$7, 33, 2, 1250);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$7, 36, 2, 1285);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$7, 41, 4, 1494);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$7, 40, 2, 1462);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$7, 43, 2, 1575);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$7, 7, 0, 283);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, b0);
    			append_dev(p0, t4);
    			append_dev(p0, br0);
    			append_dev(p0, t5);
    			append_dev(p0, br1);
    			append_dev(p0, t6);
    			append_dev(p0, br2);
    			append_dev(p0, t7);
    			mount_component(scr_router_link, p0, null);
    			append_dev(p0, t8);
    			append_dev(div, t9);
    			append_dev(div, pre0);
    			append_dev(pre0, b1);
    			append_dev(pre0, t11);
    			append_dev(div, t12);
    			append_dev(div, br3);
    			append_dev(div, t13);
    			mount_component(scr_onerroranatomy, div, null);
    			append_dev(div, t14);
    			append_dev(div, p1);
    			append_dev(div, t16);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t18);
    			append_dev(div, pre1);
    			append_dev(div, t20);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_router_link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link.$set(scr_router_link_changes);
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_router_link.$$.fragment, local);
    			transition_in(scr_onerroranatomy.$$.fragment, local);
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_link.$$.fragment, local);
    			transition_out(scr_onerroranatomy.$$.fragment, local);
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_router_link);
    			destroy_component(scr_onerroranatomy);
    			destroy_component(scr_pagefooter);
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

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_RouteObjectOnError", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouteObjectOnError> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton,
    		SCR_OnErrorAnatomy
    	});

    	return [];
    }

    class SCR_RouteObjectOnError extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteObjectOnError",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    var SCR_RouteObjectOnError$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteObjectOnError
    });

    /* src/docs/pages/SCR_RouteComponentProperties.svelte generated by Svelte v3.37.0 */
    const file$6 = "src/docs/pages/SCR_RouteComponentProperties.svelte";

    // (15:4) <SCR_ROUTER_LINK       to={{ name: "routeComponentComponentsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_2(ctx) {
    	let a;
    	let t1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "components - that can be check in the next section -";
    			t1 = text(", and some are crucial for it to work correctly.");
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$6, 18, 6, 679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(15:4) <SCR_ROUTER_LINK       to={{ name: \\\"routeComponentComponentsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (63:33) <SCR_ROUTER_LINK       to={{ name: "routeObjectOptionsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$1(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "route object properties section.";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$6, 66, 6, 2447);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(63:33) <SCR_ROUTER_LINK       to={{ name: \\\"routeObjectOptionsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (168:2) <SCR_PageFooter>
    function create_default_slot$6(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "routeObjectOnErrorRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "routeComponentComponentsRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$6, 169, 6, 5815);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$6, 168, 4, 5791);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(168:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let h40;
    	let t1;
    	let p0;
    	let t2;
    	let a;
    	let t4;
    	let scr_router_link0;
    	let t5;
    	let br0;
    	let t6;
    	let br1;
    	let t7;
    	let t8;
    	let pre0;
    	let b0;
    	let t10;
    	let b1;
    	let t12;
    	let b2;
    	let t14;
    	let b3;
    	let t16;
    	let b4;
    	let t18;
    	let b5;
    	let t20;
    	let t21;
    	let hr0;
    	let t22;
    	let h41;
    	let t24;
    	let p1;
    	let t25;
    	let br2;
    	let t26;
    	let scr_router_link1;
    	let t27;
    	let br3;
    	let t28;
    	let br4;
    	let t29;
    	let t30;
    	let pre1;
    	let b6;
    	let t32;
    	let b7;
    	let t34;
    	let b8;
    	let t36;
    	let t37;
    	let p2;
    	let t39;
    	let hr1;
    	let t40;
    	let h42;
    	let t42;
    	let p3;
    	let t43;
    	let b9;
    	let t45;
    	let t46;
    	let pre2;
    	let b10;
    	let t48;
    	let t49;
    	let hr2;
    	let t50;
    	let h43;
    	let t52;
    	let p4;
    	let t53;
    	let b11;
    	let t55;
    	let t56;
    	let pre3;
    	let b12;
    	let t58;
    	let t59;
    	let p5;
    	let t61;
    	let center;
    	let small;
    	let t63;
    	let pre4;
    	let t65;
    	let scr_pagefooter;
    	let current;

    	scr_router_link0 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeComponentComponentsRoute" },
    				elementProps: {
    					style: "display: inline; cursor: pointer;"
    				},
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link1 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectOptionsRoute" },
    				elementProps: {
    					style: "display: inline; cursor: pointer;"
    				},
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			h40.textContent = "Route Component - Properties";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("The route component is a ");
    			a = element("a");
    			a.textContent = "Svelte Component";
    			t4 = text("\n    , so it can receive parameters to pass further. Some of these parameters are\n    ");
    			create_component(scr_router_link0.$$.fragment);
    			t5 = space();
    			br0 = element("br");
    			t6 = space();
    			br1 = element("br");
    			t7 = text("\n\n    Lets see these parameters that aren't components:");
    			t8 = space();
    			pre0 = element("pre");
    			b0 = element("b");
    			b0.textContent = "// Importing the router component";
    			t10 = text("\nimport { SCR_ROUTER_COMPONENT } from \"svelte-client-router\"\nimport SCR_Layout from \"../testComponents/SCR_Layout.svelte\";\nimport SCR_Loading from \"../testComponents/SCR_LoadingComponent.svelte\";\nimport SCR_Error from \"../testComponents/SCR_Error.svelte\";\nimport SCR_NotFound from \"../testComponents/SCR_NotFound.svelte\";\n\n");
    			b1 = element("b");
    			b1.textContent = "// Define the router object array";
    			t12 = text("\nconst routes = [\n  {\n    ... ");
    			b2 = element("b");
    			b2.textContent = "// Your routes definitions";
    			t14 = text("\n  }\n]\n\n");
    			b3 = element("b");
    			b3.textContent = "// Example of usage";
    			t16 = text("\n<SCR_ROUTER_COMPONENT \n  bind:routes \n  defaultLayoutComponent={SCR_Layout}\n  notFoundComponent={SCR_NotFound}\n  errorComponent={SCR_Error}\n  loadingComponent={SCR_Loading}\n  allProps={... ");
    			b4 = element("b");
    			b4.textContent = "// Passing parameters to be available in and routes and all components";
    			t18 = text(" }\n  allLoadingProps={... ");
    			b5 = element("b");
    			b5.textContent = "// Passing parameters to be available in and routes in loading component";
    			t20 = text(" }\n/>");
    			t21 = space();
    			hr0 = element("hr");
    			t22 = space();
    			h41 = element("h4");
    			h41.textContent = "Routes";
    			t24 = space();
    			p1 = element("p");
    			t25 = text("This is where you declare all your routes. It is the index of your\n    application. It has several options that you can configure.\n    ");
    			br2 = element("br");
    			t26 = text("\n    For more information see the ");
    			create_component(scr_router_link1.$$.fragment);
    			t27 = space();
    			br3 = element("br");
    			t28 = space();
    			br4 = element("br");
    			t29 = text("\n    Lets check out a complete example of declaration with all possible options:");
    			t30 = space();
    			pre1 = element("pre");
    			b6 = element("b");
    			b6.textContent = "// Setting Route Object Definition Example";
    			t32 = text("\nconst routes = [\n  {\n    name: \"routeName1\",\n    path: \"/test1\",\n    component: SCR_C1,\n\n    ");
    			b7 = element("b");
    			b7.textContent = "// This property has preference over component property";
    			t34 = text("\n    lazyLoadComponent: () =>\n      import(\"./docs/pages/SCR_RouteComponentProperties.svelte\"),\n    layout: SCR_Layout,\n\n    ");
    			b8 = element("b");
    			b8.textContent = "// This property has preference over layout property";
    			t36 = text("\n    lazyLoadLayoutComponent: () =>\n      import(\"./docs/SCR_Layout.svelte\"),\n    ignoreLayout: false,\n    ignoreScroll: false,\n    scrollProps: {\n      top: 0,\n      left: 0,\n      behavior: \"smooth\",\n      timeout: 10, // timeout must be greater than 10 milliseconds\n    },\n    title: \"First Route Title\",\n    params: { myCustomParam: \"text param!\", }\n    loadingProps: { textLoading: \"Loading this route...\", }\n    ignoreGlobalBeforeFunction: false,\n    executeRouteBEFBeforeGlobalBEF: false,\n    forceReload: false,\n    afterBeforeEnter: (routeObjParams) => console.log(routeObjParams)\n    beforeEnter: [\n      (resolve, routeFrom, routeTo, routeObjParams, payload) => resolve(true),\n      (resolve, routeFrom, routeTo, routeObjParams, payload) => resolve(true),\n      (resolve, routeFrom, routeTo, routeObjParams, payload) => resolve(true),\n    ],\n    onError: (err, routeObjParams) => console.error(err)\n  },\n]");
    			t37 = space();
    			p2 = element("p");
    			p2.textContent = "Each route defined inside the route array object can have these options.\n    Very robust and we can see that SCR is focused on before enter behaviour.";
    			t39 = space();
    			hr1 = element("hr");
    			t40 = space();
    			h42 = element("h4");
    			h42.textContent = "All Props";
    			t42 = space();
    			p3 = element("p");
    			t43 = text("The ");
    			b9 = element("b");
    			b9.textContent = "allProps";
    			t45 = text(" option can be passed to the router component. It must be\n    an object with all the properties that you want to deliver to every route and\n    component. This property will be made available everywhere.");
    			t46 = space();
    			pre2 = element("pre");
    			b10 = element("b");
    			b10.textContent = "// Example";
    			t48 = text("\nconst allProps = {\n  passToAll: \"OK\"\n}");
    			t49 = space();
    			hr2 = element("hr");
    			t50 = space();
    			h43 = element("h4");
    			h43.textContent = "All Loading Props";
    			t52 = space();
    			p4 = element("p");
    			t53 = text("The ");
    			b11 = element("b");
    			b11.textContent = "allLoadingProps";
    			t55 = text(" option can be passed to the router component. It must\n    be an object with all the properties that you want to deliver to every route\n    when loading the component.");
    			t56 = space();
    			pre3 = element("pre");
    			b12 = element("b");
    			b12.textContent = "// Example";
    			t58 = text("\nconst allLoadingProps = {\n  passToAll: \"OK\"\n}");
    			t59 = space();
    			p5 = element("p");
    			p5.textContent = "Now that we saw the basic properties of the component. In the next section\n    we will explore the SCR component components properties.";
    			t61 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t63 = space();
    			pre4 = element("pre");
    			pre4.textContent = "{\n  name: \"routeComponentPropertiesRoute\",\n  path: \"/svelte-client-router/routeComponentProperties\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_RouteComponentProperties.svelte\"),\n  title: \"SCR - Route Component - Properties\",\n}";
    			t65 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$6, 7, 2, 232);
    			attr_dev(a, "href", "https://svelte.dev/tutorial/basics");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$6, 9, 29, 345);
    			add_location(br0, file$6, 22, 4, 869);
    			add_location(br1, file$6, 23, 4, 880);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$6, 8, 2, 287);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$6, 30, 0, 978);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$6, 37, 0, 1365);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$6, 40, 8, 1454);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$6, 44, 0, 1514);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$6, 51, 21, 1792);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$6, 52, 28, 1919);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$6, 27, 2, 951);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$6, 56, 2, 2038);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$6, 57, 2, 2062);
    			add_location(br2, file$6, 61, 4, 2263);
    			add_location(br3, file$6, 70, 4, 2569);
    			add_location(br4, file$6, 71, 4, 2580);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$6, 58, 2, 2095);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$6, 77, 0, 2703);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$6, 84, 4, 2865);
    			attr_dev(b8, "class", "scr-b");
    			add_location(b8, file$6, 89, 4, 3069);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$6, 74, 2, 2676);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$6, 116, 2, 4123);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$6, 120, 2, 4316);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$6, 121, 2, 4340);
    			add_location(b9, file$6, 123, 8, 4413);
    			attr_dev(p3, "class", "scr-text-justify");
    			add_location(p3, file$6, 122, 2, 4376);
    			attr_dev(b10, "class", "scr-b");
    			add_location(b10, file$6, 130, 0, 4668);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$6, 127, 2, 4641);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$6, 135, 2, 4760);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$6, 136, 2, 4784);
    			add_location(b11, file$6, 138, 8, 4865);
    			attr_dev(p4, "class", "scr-text-justify");
    			add_location(p4, file$6, 137, 2, 4828);
    			attr_dev(b12, "class", "scr-b");
    			add_location(b12, file$6, 145, 0, 5091);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$6, 142, 2, 5064);
    			attr_dev(p5, "class", "scr-text-justify");
    			add_location(p5, file$6, 150, 2, 5190);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$6, 155, 4, 5400);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$6, 154, 2, 5368);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$6, 157, 2, 5481);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$6, 6, 0, 207);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, a);
    			append_dev(p0, t4);
    			mount_component(scr_router_link0, p0, null);
    			append_dev(p0, t5);
    			append_dev(p0, br0);
    			append_dev(p0, t6);
    			append_dev(p0, br1);
    			append_dev(p0, t7);
    			append_dev(div, t8);
    			append_dev(div, pre0);
    			append_dev(pre0, b0);
    			append_dev(pre0, t10);
    			append_dev(pre0, b1);
    			append_dev(pre0, t12);
    			append_dev(pre0, b2);
    			append_dev(pre0, t14);
    			append_dev(pre0, b3);
    			append_dev(pre0, t16);
    			append_dev(pre0, b4);
    			append_dev(pre0, t18);
    			append_dev(pre0, b5);
    			append_dev(pre0, t20);
    			append_dev(div, t21);
    			append_dev(div, hr0);
    			append_dev(div, t22);
    			append_dev(div, h41);
    			append_dev(div, t24);
    			append_dev(div, p1);
    			append_dev(p1, t25);
    			append_dev(p1, br2);
    			append_dev(p1, t26);
    			mount_component(scr_router_link1, p1, null);
    			append_dev(p1, t27);
    			append_dev(p1, br3);
    			append_dev(p1, t28);
    			append_dev(p1, br4);
    			append_dev(p1, t29);
    			append_dev(div, t30);
    			append_dev(div, pre1);
    			append_dev(pre1, b6);
    			append_dev(pre1, t32);
    			append_dev(pre1, b7);
    			append_dev(pre1, t34);
    			append_dev(pre1, b8);
    			append_dev(pre1, t36);
    			append_dev(div, t37);
    			append_dev(div, p2);
    			append_dev(div, t39);
    			append_dev(div, hr1);
    			append_dev(div, t40);
    			append_dev(div, h42);
    			append_dev(div, t42);
    			append_dev(div, p3);
    			append_dev(p3, t43);
    			append_dev(p3, b9);
    			append_dev(p3, t45);
    			append_dev(div, t46);
    			append_dev(div, pre2);
    			append_dev(pre2, b10);
    			append_dev(pre2, t48);
    			append_dev(div, t49);
    			append_dev(div, hr2);
    			append_dev(div, t50);
    			append_dev(div, h43);
    			append_dev(div, t52);
    			append_dev(div, p4);
    			append_dev(p4, t53);
    			append_dev(p4, b11);
    			append_dev(p4, t55);
    			append_dev(div, t56);
    			append_dev(div, pre3);
    			append_dev(pre3, b12);
    			append_dev(pre3, t58);
    			append_dev(div, t59);
    			append_dev(div, p5);
    			append_dev(div, t61);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t63);
    			append_dev(div, pre4);
    			append_dev(div, t65);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_router_link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link0_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link0.$set(scr_router_link0_changes);
    			const scr_router_link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link1_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link1.$set(scr_router_link1_changes);
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_router_link0.$$.fragment, local);
    			transition_in(scr_router_link1.$$.fragment, local);
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_link0.$$.fragment, local);
    			transition_out(scr_router_link1.$$.fragment, local);
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_router_link0);
    			destroy_component(scr_router_link1);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_RouteComponentProperties", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouteComponentProperties> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton
    	});

    	return [];
    }

    class SCR_RouteComponentProperties extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteComponentProperties",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    var SCR_RouteComponentProperties$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteComponentProperties
    });

    /* src/docs/pages/SCR_RouteComponentComponents.svelte generated by Svelte v3.37.0 */
    const file$5 = "src/docs/pages/SCR_RouteComponentComponents.svelte";

    // (244:2) <SCR_PageFooter>
    function create_default_slot$5(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "routeComponentPropertiesRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "navigationRoutingRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$5, 245, 6, 7263);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$5, 244, 4, 7239);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(244:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let h40;
    	let t1;
    	let p0;
    	let t2;
    	let br0;
    	let t3;
    	let t4;
    	let hr0;
    	let t5;
    	let h41;
    	let t7;
    	let p1;
    	let t8;
    	let br1;
    	let t9;
    	let br2;
    	let t10;
    	let br3;
    	let t11;
    	let t12;
    	let pre0;
    	let b0;
    	let t14;
    	let b1;
    	let t16;
    	let b2;
    	let t18;
    	let b3;
    	let t20;
    	let t21;
    	let p2;
    	let t23;
    	let pre1;
    	let b4;
    	let t25;
    	let b5;
    	let t27;
    	let b6;
    	let t29;
    	let b7;
    	let t31;
    	let t32;
    	let hr1;
    	let t33;
    	let h42;
    	let t35;
    	let p3;
    	let t36;
    	let br4;
    	let t37;
    	let b8;
    	let t39;
    	let b9;
    	let t41;
    	let t42;
    	let pre2;
    	let b10;
    	let t44;
    	let b11;
    	let t46;
    	let b12;
    	let t48;
    	let b13;
    	let t50;
    	let t51;
    	let p4;
    	let t53;
    	let pre3;
    	let b14;
    	let t55;
    	let b15;
    	let t57;
    	let t58;
    	let hr2;
    	let t59;
    	let h43;
    	let t61;
    	let p5;
    	let t62;
    	let br5;
    	let t63;
    	let t64;
    	let pre4;
    	let b16;
    	let t66;
    	let b17;
    	let t68;
    	let b18;
    	let t70;
    	let b19;
    	let t72;
    	let t73;
    	let p6;
    	let t75;
    	let pre5;
    	let b20;
    	let t77;
    	let b21;
    	let t79;
    	let t80;
    	let hr3;
    	let t81;
    	let h44;
    	let t83;
    	let p7;
    	let t84;
    	let br6;
    	let t85;
    	let t86;
    	let pre6;
    	let b22;
    	let t88;
    	let b23;
    	let t90;
    	let b24;
    	let t92;
    	let b25;
    	let t94;
    	let t95;
    	let p8;
    	let t97;
    	let pre7;
    	let b26;
    	let t99;
    	let b27;
    	let t101;
    	let t102;
    	let center;
    	let small;
    	let t104;
    	let pre8;
    	let t106;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			h40.textContent = "Route Component - Components";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("As said throught this documentation it is encouraged to provide your own\n    custom components. SCR functions can work with no component provided by you.\n    But it is not ideal they are very simple and minimalistic.\n    ");
    			br0 = element("br");
    			t3 = text("\n    Lets see all the components one by one:");
    			t4 = space();
    			hr0 = element("hr");
    			t5 = space();
    			h41 = element("h4");
    			h41.textContent = "Layout Component";
    			t7 = space();
    			p1 = element("p");
    			t8 = text("The Layout Component is the layout used to encapsulate all your route\n    components. It can be override on route declaration object for an specific\n    one for that route.\n    ");
    			br1 = element("br");
    			t9 = text("\n    It must be declared a default slot inside of the Layout Component or else your\n    route component will not be drawed.\n    ");
    			br2 = element("br");
    			t10 = space();
    			br3 = element("br");
    			t11 = text("\n    The Global Layout must be passed to SCR Router Component as exampled below:");
    			t12 = space();
    			pre0 = element("pre");
    			b0 = element("b");
    			b0.textContent = "// Importing your components";
    			t14 = text("\nimport { SCR_ROUTER_COMPONENT } from \"svelte-client-router\"\nimport SCR_Layout from \"../testComponents/SCR_Layout.svelte\";\n\n");
    			b1 = element("b");
    			b1.textContent = "// Define the router object array";
    			t16 = text("\nconst routes = [\n  {\n    ... ");
    			b2 = element("b");
    			b2.textContent = "// Your routes definitions";
    			t18 = text("\n  }\n]\n\n");
    			b3 = element("b");
    			b3.textContent = "// Example of usage";
    			t20 = text("\n<SCR_ROUTER_COMPONENT \n  bind:routes \n  defaultLayoutComponent={SCR_Layout}\n/>");
    			t21 = space();
    			p2 = element("p");
    			p2.textContent = "Next an example of Svelte Layout Component:";
    			t23 = space();
    			pre1 = element("pre");
    			b4 = element("b");
    			b4.textContent = "// Example of a Svelte Layout Component";
    			t25 = text("\n<script>\n  import SCR_Menu from \"./SCR_Menu.svelte\";\n  import SCR_Footer from \"./SCR_Footer.svelte\";\n\n  ");
    			b5 = element("b");
    			b5.textContent = "// This two following variables are always available in the layout component";
    			t27 = text("\n  export let currentRoute;\n  export let fromRoute;\n\n  ");
    			b6 = element("b");
    			b6.textContent = "// Any other params declared on before enter functions \n  // all props, payload, etc.. will be made available here too";
    			t29 = text("\n  ...\n</script>\n\n<div class=\"scr-main-layout\">\n  <div class=\"scr-header\">\n    <slot name=\"scr_header\">\n      <h2 class=\"scr-main-layout__header\">\n        Svelte Client Router - The Svelte SPA Router!\n      </h2>\n\n    ");
    			b7 = element("b");
    			b7.textContent = "<--! REMEMBER TO DECLARE A DEFAULT SLOT! ->";
    			t31 = text("\n    </slot>\n\n  </div>\n  <div class=\"scr-main\">\n    <SCR_Menu />\n    <div class=\"scr-pages\"><slot /></div>\n  </div>\n  <div><SCR_Footer /></div>\n</div>");
    			t32 = space();
    			hr1 = element("hr");
    			t33 = space();
    			h42 = element("h4");
    			h42.textContent = "Loading Component";
    			t35 = space();
    			p3 = element("p");
    			t36 = text("The Loading Component is the loading screen used to show when before enter\n    routes are been processed.\n    ");
    			br4 = element("br");
    			t37 = text("\n    It will receive ");
    			b8 = element("b");
    			b8.textContent = "allLoadingProps";
    			t39 = text(" declared and any route object\n    ");
    			b9 = element("b");
    			b9.textContent = "loadingProps";
    			t41 = text(" defined.");
    			t42 = space();
    			pre2 = element("pre");
    			b10 = element("b");
    			b10.textContent = "// Importing your components";
    			t44 = text("\nimport { SCR_ROUTER_COMPONENT } from \"svelte-client-router\"\nimport SCR_Loading from \"../testComponents/SCR_Loading.svelte\";\n\n");
    			b11 = element("b");
    			b11.textContent = "// Define the router object array";
    			t46 = text("\nconst routes = [\n  {\n    ... ");
    			b12 = element("b");
    			b12.textContent = "// Your routes definitions";
    			t48 = text("\n  }\n]\n\n");
    			b13 = element("b");
    			b13.textContent = "// Example of usage";
    			t50 = text("\n<SCR_ROUTER_COMPONENT \n  bind:routes \n  loadingComponent={SCR_Loading}\n/>");
    			t51 = space();
    			p4 = element("p");
    			p4.textContent = "Next an example of Svelte Loading Component:";
    			t53 = space();
    			pre3 = element("pre");
    			b14 = element("b");
    			b14.textContent = "// Example of a Svelte Loading Component";
    			t55 = text("\n<script>\n\n  ");
    			b15 = element("b");
    			b15.textContent = "// This variable was passed on loadingProps - Route Object Definition";
    			t57 = text("\n  export let loadingText = \"Loading...\";\n</script>\n\n<center class=\"scr-center\">\n  <div class=\"scr-lds-spinner\">\n    <div />\n    <div />\n    <div />\n    <div />\n    <div />\n    <div />\n    <div />\n    <div />\n    <div />\n    <div />\n    <div />\n    <div />\n  </div>\n  <h1 class=\"scr-h1\">{loadingText}</h1>\n</center>");
    			t58 = space();
    			hr2 = element("hr");
    			t59 = space();
    			h43 = element("h4");
    			h43.textContent = "Not Found Component";
    			t61 = space();
    			p5 = element("p");
    			t62 = text("The Not Found Component is the component that must be loaded when the user\n    try to access a not existent route.\n    ");
    			br5 = element("br");
    			t63 = text("\n    It will receive all the parameters available.");
    			t64 = space();
    			pre4 = element("pre");
    			b16 = element("b");
    			b16.textContent = "// Importing your components";
    			t66 = text("\nimport { SCR_ROUTER_COMPONENT } from \"svelte-client-router\"\nimport SCR_NotFound from \"../testComponents/SCR_NotFound.svelte\";\n\n");
    			b17 = element("b");
    			b17.textContent = "// Define the router object array";
    			t68 = text("\nconst routes = [\n  {\n    ... ");
    			b18 = element("b");
    			b18.textContent = "// Your routes definitions";
    			t70 = text("\n  }\n]\n\n");
    			b19 = element("b");
    			b19.textContent = "// Example of usage";
    			t72 = text("\n<SCR_ROUTER_COMPONENT \n  bind:routes \n  notFoundComponent={SCR_NotFound}\n/>");
    			t73 = space();
    			p6 = element("p");
    			p6.textContent = "Next an example of Svelte Not Found Component:";
    			t75 = space();
    			pre5 = element("pre");
    			b20 = element("b");
    			b20.textContent = "// Example of a Svelte Not Found Component";
    			t77 = text("\n<script>\n\n  ");
    			b21 = element("b");
    			b21.textContent = "// Example of route store usage";
    			t79 = text("\n  import routerStore from \"../js/store/router.js\";\n\n</script>\n<center class=\"scr-center\">\n  <p class=\"scr-p\">Not Found</p>\n  <p class=\"scr-p-small\">{$routerStore.currentLocation || \"='(\"}</p>\n</center>");
    			t80 = space();
    			hr3 = element("hr");
    			t81 = space();
    			h44 = element("h4");
    			h44.textContent = "Error Component";
    			t83 = space();
    			p7 = element("p");
    			t84 = text("The Error Component is the component that must be loaded when something goes\n    wrong on routing.\n    ");
    			br6 = element("br");
    			t85 = text("\n    It will receive all the parameters available.");
    			t86 = space();
    			pre6 = element("pre");
    			b22 = element("b");
    			b22.textContent = "// Importing your components";
    			t88 = text("\nimport { SCR_ROUTER_COMPONENT } from \"svelte-client-router\"\nimport SCR_Error from \"../testComponents/SCR_Error.svelte\";\n\n");
    			b23 = element("b");
    			b23.textContent = "// Define the router object array";
    			t90 = text("\nconst routes = [\n  {\n    ... ");
    			b24 = element("b");
    			b24.textContent = "// Your routes definitions";
    			t92 = text("\n  }\n]\n\n");
    			b25 = element("b");
    			b25.textContent = "// Example of usage";
    			t94 = text("\n<SCR_ROUTER_COMPONENT \n  bind:routes \n  errorComponent={SCR_Error}\n/>");
    			t95 = space();
    			p8 = element("p");
    			p8.textContent = "Next an example of Svelte Error Component:";
    			t97 = space();
    			pre7 = element("pre");
    			b26 = element("b");
    			b26.textContent = "// Example of a Svelte Error Component";
    			t99 = text("\n<script>\n\n  ");
    			b27 = element("b");
    			b27.textContent = "// This variable was passed on onError Function";
    			t101 = text("\n  export let errorMessage = \"An error has occured!\";\n\n</script>\n\n<center class=\"scr-center\">\n  <p class=\"scr-p\">Error</p>\n  <p class=\"scr-p-small\">{errorMessage}</p>\n</center>");
    			t102 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t104 = space();
    			pre8 = element("pre");
    			pre8.textContent = "{\n  name: \"routeComponentComponentsRoute\",\n  path: \"/svelte-client-router/routeComponentComponents\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_RouteComponentComponents.svelte\"),\n  title: \"SCR - Route Component - Components\",\n}";
    			t106 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$5, 6, 2, 180);
    			add_location(br0, file$5, 11, 4, 489);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$5, 7, 2, 235);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$5, 14, 2, 549);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$5, 15, 2, 573);
    			add_location(br1, file$5, 20, 4, 826);
    			add_location(br2, file$5, 23, 4, 960);
    			add_location(br3, file$5, 24, 4, 971);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$5, 16, 2, 616);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$5, 30, 0, 1094);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$5, 34, 0, 1277);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$5, 37, 8, 1366);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$5, 41, 0, 1426);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$5, 27, 2, 1067);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$5, 47, 2, 1573);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$5, 50, 0, 1677);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$5, 55, 2, 1848);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$5, 59, 2, 2000);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$5, 73, 4, 2399);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$5, 48, 2, 1651);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$5, 84, 2, 2701);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$5, 85, 2, 2725);
    			add_location(br4, file$5, 89, 4, 2912);
    			add_location(b8, file$5, 90, 20, 2939);
    			add_location(b9, file$5, 91, 4, 2996);
    			attr_dev(p3, "class", "scr-text-justify");
    			add_location(p3, file$5, 86, 2, 2769);
    			attr_dev(b10, "class", "scr-b");
    			add_location(b10, file$5, 96, 0, 3061);
    			attr_dev(b11, "class", "scr-b");
    			add_location(b11, file$5, 100, 0, 3246);
    			attr_dev(b12, "class", "scr-b");
    			add_location(b12, file$5, 103, 8, 3335);
    			attr_dev(b13, "class", "scr-b");
    			add_location(b13, file$5, 107, 0, 3395);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$5, 93, 2, 3034);
    			attr_dev(p4, "class", "scr-text-justify");
    			add_location(p4, file$5, 113, 2, 3537);
    			attr_dev(b14, "class", "scr-b");
    			add_location(b14, file$5, 116, 0, 3642);
    			attr_dev(b15, "class", "scr-b");
    			add_location(b15, file$5, 119, 2, 3722);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$5, 114, 2, 3616);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$5, 141, 2, 4262);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$5, 142, 2, 4286);
    			add_location(br5, file$5, 146, 4, 4484);
    			attr_dev(p5, "class", "scr-text-justify");
    			add_location(p5, file$5, 143, 2, 4332);
    			attr_dev(b16, "class", "scr-b");
    			add_location(b16, file$5, 152, 0, 4577);
    			attr_dev(b17, "class", "scr-b");
    			add_location(b17, file$5, 156, 0, 4764);
    			attr_dev(b18, "class", "scr-b");
    			add_location(b18, file$5, 159, 8, 4853);
    			attr_dev(b19, "class", "scr-b");
    			add_location(b19, file$5, 163, 0, 4913);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$5, 149, 2, 4550);
    			attr_dev(p6, "class", "scr-text-justify");
    			add_location(p6, file$5, 169, 2, 5057);
    			attr_dev(b20, "class", "scr-b");
    			add_location(b20, file$5, 172, 0, 5164);
    			attr_dev(b21, "class", "scr-b");
    			add_location(b21, file$5, 175, 2, 5246);
    			attr_dev(pre5, "class", "scr-pre");
    			add_location(pre5, file$5, 170, 2, 5138);
    			attr_dev(hr3, "class", "scr-hr");
    			add_location(hr3, file$5, 184, 2, 5563);
    			attr_dev(h44, "class", "scr-h4");
    			add_location(h44, file$5, 185, 2, 5587);
    			add_location(br6, file$5, 189, 4, 5765);
    			attr_dev(p7, "class", "scr-text-justify");
    			add_location(p7, file$5, 186, 2, 5629);
    			attr_dev(b22, "class", "scr-b");
    			add_location(b22, file$5, 195, 0, 5858);
    			attr_dev(b23, "class", "scr-b");
    			add_location(b23, file$5, 199, 0, 6039);
    			attr_dev(b24, "class", "scr-b");
    			add_location(b24, file$5, 202, 8, 6128);
    			attr_dev(b25, "class", "scr-b");
    			add_location(b25, file$5, 206, 0, 6188);
    			attr_dev(pre6, "class", "scr-pre");
    			add_location(pre6, file$5, 192, 2, 5831);
    			attr_dev(p8, "class", "scr-text-justify");
    			add_location(p8, file$5, 212, 2, 6326);
    			attr_dev(b26, "class", "scr-b");
    			add_location(b26, file$5, 215, 0, 6429);
    			attr_dev(b27, "class", "scr-b");
    			add_location(b27, file$5, 218, 2, 6507);
    			attr_dev(pre7, "class", "scr-pre");
    			add_location(pre7, file$5, 213, 2, 6403);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$5, 231, 4, 6848);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$5, 230, 2, 6816);
    			attr_dev(pre8, "class", "scr-pre");
    			add_location(pre8, file$5, 233, 2, 6929);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$5, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, br0);
    			append_dev(p0, t3);
    			append_dev(div, t4);
    			append_dev(div, hr0);
    			append_dev(div, t5);
    			append_dev(div, h41);
    			append_dev(div, t7);
    			append_dev(div, p1);
    			append_dev(p1, t8);
    			append_dev(p1, br1);
    			append_dev(p1, t9);
    			append_dev(p1, br2);
    			append_dev(p1, t10);
    			append_dev(p1, br3);
    			append_dev(p1, t11);
    			append_dev(div, t12);
    			append_dev(div, pre0);
    			append_dev(pre0, b0);
    			append_dev(pre0, t14);
    			append_dev(pre0, b1);
    			append_dev(pre0, t16);
    			append_dev(pre0, b2);
    			append_dev(pre0, t18);
    			append_dev(pre0, b3);
    			append_dev(pre0, t20);
    			append_dev(div, t21);
    			append_dev(div, p2);
    			append_dev(div, t23);
    			append_dev(div, pre1);
    			append_dev(pre1, b4);
    			append_dev(pre1, t25);
    			append_dev(pre1, b5);
    			append_dev(pre1, t27);
    			append_dev(pre1, b6);
    			append_dev(pre1, t29);
    			append_dev(pre1, b7);
    			append_dev(pre1, t31);
    			append_dev(div, t32);
    			append_dev(div, hr1);
    			append_dev(div, t33);
    			append_dev(div, h42);
    			append_dev(div, t35);
    			append_dev(div, p3);
    			append_dev(p3, t36);
    			append_dev(p3, br4);
    			append_dev(p3, t37);
    			append_dev(p3, b8);
    			append_dev(p3, t39);
    			append_dev(p3, b9);
    			append_dev(p3, t41);
    			append_dev(div, t42);
    			append_dev(div, pre2);
    			append_dev(pre2, b10);
    			append_dev(pre2, t44);
    			append_dev(pre2, b11);
    			append_dev(pre2, t46);
    			append_dev(pre2, b12);
    			append_dev(pre2, t48);
    			append_dev(pre2, b13);
    			append_dev(pre2, t50);
    			append_dev(div, t51);
    			append_dev(div, p4);
    			append_dev(div, t53);
    			append_dev(div, pre3);
    			append_dev(pre3, b14);
    			append_dev(pre3, t55);
    			append_dev(pre3, b15);
    			append_dev(pre3, t57);
    			append_dev(div, t58);
    			append_dev(div, hr2);
    			append_dev(div, t59);
    			append_dev(div, h43);
    			append_dev(div, t61);
    			append_dev(div, p5);
    			append_dev(p5, t62);
    			append_dev(p5, br5);
    			append_dev(p5, t63);
    			append_dev(div, t64);
    			append_dev(div, pre4);
    			append_dev(pre4, b16);
    			append_dev(pre4, t66);
    			append_dev(pre4, b17);
    			append_dev(pre4, t68);
    			append_dev(pre4, b18);
    			append_dev(pre4, t70);
    			append_dev(pre4, b19);
    			append_dev(pre4, t72);
    			append_dev(div, t73);
    			append_dev(div, p6);
    			append_dev(div, t75);
    			append_dev(div, pre5);
    			append_dev(pre5, b20);
    			append_dev(pre5, t77);
    			append_dev(pre5, b21);
    			append_dev(pre5, t79);
    			append_dev(div, t80);
    			append_dev(div, hr3);
    			append_dev(div, t81);
    			append_dev(div, h44);
    			append_dev(div, t83);
    			append_dev(div, p7);
    			append_dev(p7, t84);
    			append_dev(p7, br6);
    			append_dev(p7, t85);
    			append_dev(div, t86);
    			append_dev(div, pre6);
    			append_dev(pre6, b22);
    			append_dev(pre6, t88);
    			append_dev(pre6, b23);
    			append_dev(pre6, t90);
    			append_dev(pre6, b24);
    			append_dev(pre6, t92);
    			append_dev(pre6, b25);
    			append_dev(pre6, t94);
    			append_dev(div, t95);
    			append_dev(div, p8);
    			append_dev(div, t97);
    			append_dev(div, pre7);
    			append_dev(pre7, b26);
    			append_dev(pre7, t99);
    			append_dev(pre7, b27);
    			append_dev(pre7, t101);
    			append_dev(div, t102);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t104);
    			append_dev(div, pre8);
    			append_dev(div, t106);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_RouteComponentComponents", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouteComponentComponents> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_RouteComponentComponents extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteComponentComponents",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    var SCR_RouteComponentComponents$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteComponentComponents
    });

    /* src/docs/pages/SCR_NavigationRouting.svelte generated by Svelte v3.37.0 */
    const file$4 = "src/docs/pages/SCR_NavigationRouting.svelte";

    // (96:2) <SCR_PageFooter>
    function create_default_slot$4(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "routeComponentComponentsRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "navigationStoreRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$4, 97, 6, 2756);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$4, 96, 4, 2732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(96:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let h40;
    	let t1;
    	let p0;
    	let t3;
    	let ul0;
    	let li0;
    	let b0;
    	let t5;
    	let t6;
    	let li1;
    	let b1;
    	let t8;
    	let t9;
    	let p1;
    	let t10;
    	let b2;
    	let t12;
    	let t13;
    	let hr0;
    	let t14;
    	let h41;
    	let t16;
    	let pre0;
    	let b3;
    	let t18;
    	let b4;
    	let t20;
    	let t21;
    	let hr1;
    	let t22;
    	let h42;
    	let t24;
    	let p2;
    	let t26;
    	let ul2;
    	let li5;
    	let b5;
    	let t28;
    	let ul1;
    	let li2;
    	let b6;
    	let t30;
    	let t31;
    	let li3;
    	let b7;
    	let t33;
    	let t34;
    	let li4;
    	let b8;
    	let t36;
    	let t37;
    	let br0;
    	let t38;
    	let li6;
    	let b9;
    	let t40;
    	let t41;
    	let br1;
    	let t42;
    	let li7;
    	let b10;
    	let t44;
    	let t45;
    	let hr2;
    	let t46;
    	let h43;
    	let t48;
    	let pre1;
    	let b11;
    	let t50;
    	let b12;
    	let t52;
    	let b13;
    	let t54;
    	let t55;
    	let center;
    	let small;
    	let t57;
    	let pre2;
    	let t59;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			h40.textContent = "Navigation - Routing";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "There are two main methods when routing SCR.";
    			t3 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			b0 = element("b");
    			b0.textContent = "pushRoute: ";
    			t5 = text("pushes a route forward.");
    			t6 = space();
    			li1 = element("li");
    			b1 = element("b");
    			b1.textContent = "backRoute: ";
    			t8 = text("back to the first route history, uses\n      window.history.back(-1).");
    			t9 = space();
    			p1 = element("p");
    			t10 = text("There are no secret of using them, but ");
    			b2 = element("b");
    			b2.textContent = "pushRoute";
    			t12 = text(" has some nice features.\n    Lets check them:");
    			t13 = space();
    			hr0 = element("hr");
    			t14 = space();
    			h41 = element("h4");
    			h41.textContent = "Push Route";
    			t16 = space();
    			pre0 = element("pre");
    			b3 = element("b");
    			b3.textContent = "// Importing pushRoute function";
    			t18 = text("\nimport { pushRoute } from \"svelte-client-router\"\n\n");
    			b4 = element("b");
    			b4.textContent = "// Example of Usage";
    			t20 = text("\n<script>\n  pushRoute(\"/routePath\");\n</script>");
    			t21 = space();
    			hr1 = element("hr");
    			t22 = space();
    			h42 = element("h4");
    			h42.textContent = "Push Route Function Anatomy";
    			t24 = space();
    			p2 = element("p");
    			p2.textContent = "This function can receive three paramenters as it follows:";
    			t26 = space();
    			ul2 = element("ul");
    			li5 = element("li");
    			b5 = element("b");
    			b5.textContent = "to: ";
    			t28 = text("the route path to go to. It can understand three types of\n      declarations:\n      ");
    			ul1 = element("ul");
    			li2 = element("li");
    			b6 = element("b");
    			b6.textContent = "A string path: ";
    			t30 = text("For example: \"/someRoute/to/go\"");
    			t31 = space();
    			li3 = element("li");
    			b7 = element("b");
    			b7.textContent = "path: ";
    			t33 = text("For example: { path: \"/routePath\" }");
    			t34 = space();
    			li4 = element("li");
    			b8 = element("b");
    			b8.textContent = "name: ";
    			t36 = text("For example: { name: \"theRouteName\" }");
    			t37 = space();
    			br0 = element("br");
    			t38 = space();
    			li6 = element("li");
    			b9 = element("b");
    			b9.textContent = "customParams: ";
    			t40 = text("Some custom params to send to Before Enter and After\n      Before Enter Functions as well the components");
    			t41 = space();
    			br1 = element("br");
    			t42 = space();
    			li7 = element("li");
    			b10 = element("b");
    			b10.textContent = "onError: ";
    			t44 = text("A custom onError function. This is nice because you can\n      override your route onError declaration. It will execute this function\n      instead of the route definition declared function.");
    			t45 = space();
    			hr2 = element("hr");
    			t46 = space();
    			h43 = element("h4");
    			h43.textContent = "Back Route";
    			t48 = space();
    			pre1 = element("pre");
    			b11 = element("b");
    			b11.textContent = "// Importing backRoute function";
    			t50 = text("\nimport { backRoute } from \"svelte-client-router\"\n\n");
    			b12 = element("b");
    			b12.textContent = "// Example of Usage";
    			t52 = text("\n<script>\n  ");
    			b13 = element("b");
    			b13.textContent = "// Go to previous entered route.\n  // It returns the previous route too";
    			t54 = text("\n  backRoute();\n</script>");
    			t55 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t57 = space();
    			pre2 = element("pre");
    			pre2.textContent = "{\n  name: \"routeNavigationRouting\",\n  path: \"/svelte-client-router/navigationRouting\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_NavigationRouting.svelte\"),\n  title: \"SCR - Navigation - Routing\",\n}";
    			t59 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$4, 6, 2, 180);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$4, 7, 2, 227);
    			add_location(b0, file$4, 9, 8, 319);
    			add_location(li0, file$4, 9, 4, 315);
    			add_location(b1, file$4, 11, 6, 381);
    			add_location(li1, file$4, 10, 4, 370);
    			add_location(ul0, file$4, 8, 2, 306);
    			add_location(b2, file$4, 16, 43, 560);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$4, 15, 2, 488);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$4, 19, 2, 631);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$4, 20, 2, 655);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$4, 23, 4, 722);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$4, 28, 0, 847);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$4, 21, 2, 692);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$4, 35, 2, 961);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$4, 36, 2, 985);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$4, 37, 2, 1039);
    			add_location(b5, file$4, 42, 6, 1160);
    			add_location(b6, file$4, 45, 12, 1272);
    			add_location(li2, file$4, 45, 8, 1268);
    			add_location(b7, file$4, 46, 12, 1343);
    			add_location(li3, file$4, 46, 8, 1339);
    			add_location(b8, file$4, 47, 12, 1419);
    			add_location(li4, file$4, 47, 8, 1415);
    			add_location(ul1, file$4, 44, 6, 1255);
    			add_location(li5, file$4, 41, 4, 1149);
    			add_location(br0, file$4, 50, 4, 1511);
    			add_location(b9, file$4, 52, 6, 1533);
    			add_location(li6, file$4, 51, 4, 1522);
    			add_location(br1, file$4, 55, 4, 1673);
    			add_location(b10, file$4, 57, 6, 1695);
    			add_location(li7, file$4, 56, 4, 1684);
    			add_location(ul2, file$4, 40, 2, 1140);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$4, 62, 2, 1921);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$4, 63, 2, 1945);
    			attr_dev(b11, "class", "scr-b");
    			add_location(b11, file$4, 66, 4, 2012);
    			attr_dev(b12, "class", "scr-b");
    			add_location(b12, file$4, 71, 0, 2137);
    			attr_dev(b13, "class", "scr-b");
    			add_location(b13, file$4, 75, 2, 2199);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$4, 64, 2, 1982);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$4, 83, 4, 2370);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$4, 82, 2, 2338);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$4, 85, 2, 2451);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$4, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(div, t3);
    			append_dev(div, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, b0);
    			append_dev(li0, t5);
    			append_dev(ul0, t6);
    			append_dev(ul0, li1);
    			append_dev(li1, b1);
    			append_dev(li1, t8);
    			append_dev(div, t9);
    			append_dev(div, p1);
    			append_dev(p1, t10);
    			append_dev(p1, b2);
    			append_dev(p1, t12);
    			append_dev(div, t13);
    			append_dev(div, hr0);
    			append_dev(div, t14);
    			append_dev(div, h41);
    			append_dev(div, t16);
    			append_dev(div, pre0);
    			append_dev(pre0, b3);
    			append_dev(pre0, t18);
    			append_dev(pre0, b4);
    			append_dev(pre0, t20);
    			append_dev(div, t21);
    			append_dev(div, hr1);
    			append_dev(div, t22);
    			append_dev(div, h42);
    			append_dev(div, t24);
    			append_dev(div, p2);
    			append_dev(div, t26);
    			append_dev(div, ul2);
    			append_dev(ul2, li5);
    			append_dev(li5, b5);
    			append_dev(li5, t28);
    			append_dev(li5, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, b6);
    			append_dev(li2, t30);
    			append_dev(ul1, t31);
    			append_dev(ul1, li3);
    			append_dev(li3, b7);
    			append_dev(li3, t33);
    			append_dev(ul1, t34);
    			append_dev(ul1, li4);
    			append_dev(li4, b8);
    			append_dev(li4, t36);
    			append_dev(ul2, t37);
    			append_dev(ul2, br0);
    			append_dev(ul2, t38);
    			append_dev(ul2, li6);
    			append_dev(li6, b9);
    			append_dev(li6, t40);
    			append_dev(ul2, t41);
    			append_dev(ul2, br1);
    			append_dev(ul2, t42);
    			append_dev(ul2, li7);
    			append_dev(li7, b10);
    			append_dev(li7, t44);
    			append_dev(div, t45);
    			append_dev(div, hr2);
    			append_dev(div, t46);
    			append_dev(div, h43);
    			append_dev(div, t48);
    			append_dev(div, pre1);
    			append_dev(pre1, b11);
    			append_dev(pre1, t50);
    			append_dev(pre1, b12);
    			append_dev(pre1, t52);
    			append_dev(pre1, b13);
    			append_dev(pre1, t54);
    			append_dev(div, t55);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t57);
    			append_dev(div, pre2);
    			append_dev(div, t59);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_NavigationRouting", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_NavigationRouting> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_NavigationRouting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_NavigationRouting",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    var SCR_NavigationRouting$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_NavigationRouting
    });

    /* src/docs/pages/SCR_NavigationStore.svelte generated by Svelte v3.37.0 */
    const file$3 = "src/docs/pages/SCR_NavigationStore.svelte";

    // (60:2) <SCR_PageFooter>
    function create_default_slot$3(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "navigationRoutingRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "routerLinkPropertiesRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$3, 61, 6, 1620);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$3, 60, 4, 1596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(60:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let p;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let t5;
    	let pre0;
    	let b0;
    	let t7;
    	let b1;
    	let t9;
    	let b2;
    	let t11;
    	let b3;
    	let t13;
    	let t14;
    	let center;
    	let small;
    	let t16;
    	let pre1;
    	let t18;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Navigation - Store";
    			t1 = space();
    			p = element("p");
    			t2 = text("As well as the previous section you can import the entire navigation store.\n    This is not recommend though. If you can use the methods directly it is\n    recommended to you to do so. Because when pushing routes there is a flow to\n    be followed. Anyway just so you know there is this store and you can check\n    it like below.\n    ");
    			br0 = element("br");
    			t3 = space();
    			br1 = element("br");
    			t4 = text("\n    For more info about the anatomy of the functions provided go back to the previous\n    section.");
    			t5 = space();
    			pre0 = element("pre");
    			b0 = element("b");
    			b0.textContent = "// Importing Navigate Store";
    			t7 = text("\nimport {  \n    SCR_NAVIGATE_STORE,\n} from \"svelte-client-router\"\n\n");
    			b1 = element("b");
    			b1.textContent = "// Example of Usage";
    			t9 = text("\n<script>\n\n  ");
    			b2 = element("b");
    			b2.textContent = "// Go to defined path route";
    			t11 = text("\n  SCR_NAVIGATE_STORE.pushRoute(\"/routePath\");\n\n  ");
    			b3 = element("b");
    			b3.textContent = "// Go to previous entered route.\n  // It returns the previous route too";
    			t13 = text("\n  SCR_NAVIGATE_STORE.backRoute();\n\n</script>");
    			t14 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t16 = space();
    			pre1 = element("pre");
    			pre1.textContent = "{\n\n  name: \"routeNavigationStore\",\n  path: \"/svelte-client-router/navigationStore\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_NavigationStore.svelte\"),\n  title: \"SCR - Navigation - Store\",\n}";
    			t18 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$3, 6, 2, 180);
    			add_location(br0, file$3, 13, 4, 592);
    			add_location(br1, file$3, 14, 4, 603);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$3, 7, 2, 225);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$3, 20, 4, 748);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$3, 27, 0, 885);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$3, 32, 2, 948);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$3, 37, 2, 1050);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$3, 18, 2, 718);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$3, 46, 4, 1241);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$3, 45, 2, 1209);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$3, 48, 2, 1322);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$3, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(p, br0);
    			append_dev(p, t3);
    			append_dev(p, br1);
    			append_dev(p, t4);
    			append_dev(div, t5);
    			append_dev(div, pre0);
    			append_dev(pre0, b0);
    			append_dev(pre0, t7);
    			append_dev(pre0, b1);
    			append_dev(pre0, t9);
    			append_dev(pre0, b2);
    			append_dev(pre0, t11);
    			append_dev(pre0, b3);
    			append_dev(pre0, t13);
    			append_dev(div, t14);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t16);
    			append_dev(div, pre1);
    			append_dev(div, t18);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_NavigationStore", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_NavigationStore> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_NavigationStore extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_NavigationStore",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var SCR_NavigationStore$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_NavigationStore
    });

    /* src/docs/pages/SCR_RouterLinkProperties.svelte generated by Svelte v3.37.0 */
    const file$2 = "src/docs/pages/SCR_RouterLinkProperties.svelte";

    // (104:2) <SCR_PageFooter>
    function create_default_slot$2(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "navigationStoreRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "routerStorePropertiesRoute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$2, 105, 6, 3421);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$2, 104, 4, 3397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(104:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let h40;
    	let t1;
    	let p0;
    	let t2;
    	let br0;
    	let t3;
    	let t4;
    	let pre0;
    	let b0;
    	let t6;
    	let b1;
    	let t8;
    	let t9;
    	let hr;
    	let t10;
    	let h41;
    	let t12;
    	let p1;
    	let t14;
    	let ul1;
    	let li3;
    	let b2;
    	let t16;
    	let ul0;
    	let li0;
    	let b3;
    	let t18;
    	let t19;
    	let li1;
    	let b4;
    	let t21;
    	let t22;
    	let li2;
    	let b5;
    	let t24;
    	let t25;
    	let br1;
    	let t26;
    	let li4;
    	let b6;
    	let t28;
    	let t29;
    	let br2;
    	let t30;
    	let li5;
    	let b7;
    	let t32;
    	let t33;
    	let br3;
    	let t34;
    	let li6;
    	let b8;
    	let t36;
    	let t37;
    	let p2;
    	let t39;
    	let pre1;
    	let b9;
    	let t41;
    	let b10;
    	let t43;
    	let t44;
    	let center;
    	let small;
    	let t46;
    	let pre2;
    	let t48;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			h40.textContent = "Route Link";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("The Route Link is a component wrapper to make links. Easy to click and\n    execute what you want. It is totally customisable.\n    ");
    			br0 = element("br");
    			t3 = text("\n    Lets see how to import and use it:");
    			t4 = space();
    			pre0 = element("pre");
    			b0 = element("b");
    			b0.textContent = "// Importing Navigate Store";
    			t6 = text("\n<script>\n  import { SCR_ROUTER_LINK } from \"svelte-client-router\";\n</script>\n\n");
    			b1 = element("b");
    			b1.textContent = "<--! Example of Usage -->";
    			t8 = text("\n<SCR_ROUTER_LINK\n  to={{ name: \"routeComponentComponentsRoute\" }}\n  elementProps={{ style: \"display: inline; cursor: pointer;\" }}\n>\n  <a style=\"pointer-events: none;\">\n  components - that can be check in the next section -</a>, \n  and some are crucial for it to work correctly.\n\n</SCR_ROUTER_LINK>");
    			t9 = space();
    			hr = element("hr");
    			t10 = space();
    			h41 = element("h4");
    			h41.textContent = "Properties";
    			t12 = space();
    			p1 = element("p");
    			p1.textContent = "Pretty easy to use, isn't it? So now lets check out the component exported\n    properties:";
    			t14 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			b2 = element("b");
    			b2.textContent = "to: ";
    			t16 = text("the route path to go to. It can understand three types of\n      declarations:\n      ");
    			ul0 = element("ul");
    			li0 = element("li");
    			b3 = element("b");
    			b3.textContent = "A string path: ";
    			t18 = text("For example: \"/someRoute/to/go\"");
    			t19 = space();
    			li1 = element("li");
    			b4 = element("b");
    			b4.textContent = "path: ";
    			t21 = text("For example: { path: \"/routePath\" }");
    			t22 = space();
    			li2 = element("li");
    			b5 = element("b");
    			b5.textContent = "name: ";
    			t24 = text("For example: { name: \"theRouteName\" }");
    			t25 = space();
    			br1 = element("br");
    			t26 = space();
    			li4 = element("li");
    			b6 = element("b");
    			b6.textContent = "props: ";
    			t28 = text("Some custom params to send to Before Enter and After Before\n      Enter Functions as well the components");
    			t29 = space();
    			br2 = element("br");
    			t30 = space();
    			li5 = element("li");
    			b7 = element("b");
    			b7.textContent = "onError: ";
    			t32 = text("A custom onError function. This is nice because you can\n      override your route onError declaration. It will execute this function\n      instead of the route definition declared function.");
    			t33 = space();
    			br3 = element("br");
    			t34 = space();
    			li6 = element("li");
    			b8 = element("b");
    			b8.textContent = "elementProps: ";
    			t36 = text("This is all the HTML properties to pass to parent div\n      so you can customize it at your own will.");
    			t37 = space();
    			p2 = element("p");
    			p2.textContent = "Lets see another example:";
    			t39 = space();
    			pre1 = element("pre");
    			b9 = element("b");
    			b9.textContent = "// Importing Navigate Store";
    			t41 = text("\n<script>\n  import { SCR_ROUTER_LINK } from \"svelte-client-router\";\n</script>\n\n");
    			b10 = element("b");
    			b10.textContent = "<--! Another Example of Usage -->";
    			t43 = text("\n<SCR_ROUTER_LINK \n  to={{name: \"myRouteNameThree\" }}\n  props={{ pushCustomParam: \"someCustomParams\" }}\n  elementProps={{ style:\"background-color: green\" }}\n  onError={(err, routeObjParams) => console.log(\"Execute this instead error defined on router object! - Only if something goes wrong}\n>\n  <button>Click to Go to Defined Route Named: myRouteNameThree!</button>\n</SCR_ROUTER_LINK>");
    			t44 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t46 = space();
    			pre2 = element("pre");
    			pre2.textContent = "{\n  name: \"routerLinkPropertiesRoute\",\n  path: \"/svelte-client-router/routerLinkProperties\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_RouterLinkProperties.svelte\"),\n  title: \"SCR - Route Link - Properties\",\n}";
    			t48 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$2, 6, 2, 180);
    			add_location(br0, file$2, 10, 4, 380);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$2, 7, 2, 217);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$2, 15, 4, 465);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$2, 22, 0, 626);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$2, 13, 2, 435);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$2, 35, 2, 1056);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$2, 36, 2, 1080);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$2, 37, 2, 1117);
    			add_location(b2, file$2, 43, 6, 1270);
    			add_location(b3, file$2, 46, 12, 1382);
    			add_location(li0, file$2, 46, 8, 1378);
    			add_location(b4, file$2, 47, 12, 1453);
    			add_location(li1, file$2, 47, 8, 1449);
    			add_location(b5, file$2, 48, 12, 1529);
    			add_location(li2, file$2, 48, 8, 1525);
    			add_location(ul0, file$2, 45, 6, 1365);
    			add_location(li3, file$2, 42, 4, 1259);
    			add_location(br1, file$2, 51, 4, 1621);
    			add_location(b6, file$2, 53, 6, 1643);
    			add_location(li4, file$2, 52, 4, 1632);
    			add_location(br2, file$2, 56, 4, 1776);
    			add_location(b7, file$2, 58, 6, 1798);
    			add_location(li5, file$2, 57, 4, 1787);
    			add_location(br3, file$2, 62, 4, 2018);
    			add_location(b8, file$2, 64, 6, 2040);
    			add_location(li6, file$2, 63, 4, 2029);
    			add_location(ul1, file$2, 41, 2, 1250);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$2, 68, 2, 2183);
    			attr_dev(b9, "class", "scr-b");
    			add_location(b9, file$2, 71, 4, 2273);
    			attr_dev(b10, "class", "scr-b");
    			add_location(b10, file$2, 78, 0, 2434);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$2, 69, 2, 2243);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$2, 91, 4, 3023);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$2, 90, 2, 2991);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$2, 93, 2, 3104);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$2, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, br0);
    			append_dev(p0, t3);
    			append_dev(div, t4);
    			append_dev(div, pre0);
    			append_dev(pre0, b0);
    			append_dev(pre0, t6);
    			append_dev(pre0, b1);
    			append_dev(pre0, t8);
    			append_dev(div, t9);
    			append_dev(div, hr);
    			append_dev(div, t10);
    			append_dev(div, h41);
    			append_dev(div, t12);
    			append_dev(div, p1);
    			append_dev(div, t14);
    			append_dev(div, ul1);
    			append_dev(ul1, li3);
    			append_dev(li3, b2);
    			append_dev(li3, t16);
    			append_dev(li3, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, b3);
    			append_dev(li0, t18);
    			append_dev(ul0, t19);
    			append_dev(ul0, li1);
    			append_dev(li1, b4);
    			append_dev(li1, t21);
    			append_dev(ul0, t22);
    			append_dev(ul0, li2);
    			append_dev(li2, b5);
    			append_dev(li2, t24);
    			append_dev(ul1, t25);
    			append_dev(ul1, br1);
    			append_dev(ul1, t26);
    			append_dev(ul1, li4);
    			append_dev(li4, b6);
    			append_dev(li4, t28);
    			append_dev(ul1, t29);
    			append_dev(ul1, br2);
    			append_dev(ul1, t30);
    			append_dev(ul1, li5);
    			append_dev(li5, b7);
    			append_dev(li5, t32);
    			append_dev(ul1, t33);
    			append_dev(ul1, br3);
    			append_dev(ul1, t34);
    			append_dev(ul1, li6);
    			append_dev(li6, b8);
    			append_dev(li6, t36);
    			append_dev(div, t37);
    			append_dev(div, p2);
    			append_dev(div, t39);
    			append_dev(div, pre1);
    			append_dev(pre1, b9);
    			append_dev(pre1, t41);
    			append_dev(pre1, b10);
    			append_dev(pre1, t43);
    			append_dev(div, t44);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t46);
    			append_dev(div, pre2);
    			append_dev(div, t48);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_RouterLinkProperties", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouterLinkProperties> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_RouterLinkProperties extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouterLinkProperties",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    var SCR_RouterLinkProperties$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouterLinkProperties
    });

    /* src/docs/pages/SCR_RouterStoreProperties.svelte generated by Svelte v3.37.0 */
    const file$1 = "src/docs/pages/SCR_RouterStoreProperties.svelte";

    // (108:2) <SCR_PageFooter>
    function create_default_slot$1(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "routerLinkPropertiesRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right;",
    				text: "Next",
    				routeName: "test1Route"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file$1, 109, 6, 3071);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$1, 108, 4, 3047);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(108:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let h40;
    	let t1;
    	let p0;
    	let t2;
    	let br;
    	let t3;
    	let t4;
    	let pre0;
    	let b0;
    	let t6;
    	let b1;
    	let t8;
    	let t9;
    	let hr;
    	let t10;
    	let h41;
    	let t12;
    	let p1;
    	let t14;
    	let pre1;
    	let t16;
    	let center;
    	let small;
    	let t18;
    	let pre2;
    	let t20;
    	let scr_pagefooter;
    	let current;

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h40 = element("h4");
    			h40.textContent = "Route Store";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("Router Store is the store where all the route definitions are updated and\n    controlled. You can check real time what is happening.\n    ");
    			br = element("br");
    			t3 = text("\n    Lets see how to import and use it:");
    			t4 = space();
    			pre0 = element("pre");
    			b0 = element("b");
    			b0.textContent = "// Importing Router Store";
    			t6 = text("\n<script>\n  import { SCR_ROUTER_STORE } from \"svelte-client-router\";\n\n  ");
    			b1 = element("b");
    			b1.textContent = "// Methods inside the store";
    			t8 = text("\n  SCR_ROUTER_STORE.setRoutes();\n  SCR_ROUTER_STORE.getRoutes();\n  SCR_ROUTER_STORE.setCurrentRoute();\n  SCR_ROUTER_STORE.getCurrentRoute();\n  SCR_ROUTER_STORE.setFromRoute();\n  SCR_ROUTER_STORE.getFromRoute();\n  SCR_ROUTER_STORE.setNavigationHistory();\n  SCR_ROUTER_STORE.getNavigationHistory();\n  SCR_ROUTER_STORE.pushNavigationHistory();\n  SCR_ROUTER_STORE.popNavigationHistory();\n  SCR_ROUTER_STORE.setCurrentLocation();\n  SCR_ROUTER_STORE.getCurrentLocation();\n  SCR_ROUTER_STORE.getConfig();\n</script>");
    			t9 = space();
    			hr = element("hr");
    			t10 = space();
    			h41 = element("h4");
    			h41.textContent = "Properties";
    			t12 = space();
    			p1 = element("p");
    			p1.textContent = "Let's see the inside properties:";
    			t14 = space();
    			pre1 = element("pre");
    			pre1.textContent = "{\n  // ## Routes\n  // ## The Array object defined on initialization of the application\n  // ## Array\n  routes: [],\n\n  // ## Current Location\n  // ## Used inside the component to identify where it is coming from\n  // ## updating based on the configuration store\n  // ## Object\n  currentLocation: undefined,\n\n  // ## Current Route\n  // ## The object with current route information\n  // ## Updated before \"after before enter function\" execution\n  // ## Object\n  currentRoute: {\n    name: undefined,\n    pathname: undefined,\n    params: [],\n    hostname: undefined,\n    protocol: undefined,\n    port: undefined,\n    origin: undefined,\n    hash: undefined,\n  },\n\n  // ## From Route\n  // ## The object with from route information\n  // ## Updated before \"after before enter function\" execution\n  // ## Object\n  fromRoute: {\n    name: undefined,\n    pathname: undefined,\n    params: [],\n    hostname: undefined,\n    protocol: undefined,\n    port: undefined,\n    origin: undefined,\n    hash: undefined,\n  },\n\n  // ## Navigation History\n  // ## An array with all the route history objects - the limit is \n  // ## defined in the configuration store\n  // ## Updated before \"after before enter function\" execution\n  // ## Array\n  navigationHistory: [],\n}";
    			t16 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t18 = space();
    			pre2 = element("pre");
    			pre2.textContent = "{\n  name: \"routerStorePropertiesRoute\",\n  path: \"/svelte-client-router/routerStoreProperties\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_RouterStoreProperties.svelte\"),\n  title: \"SCR - Route Store - Properties\",\n}";
    			t20 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$1, 6, 2, 180);
    			add_location(br, file$1, 10, 4, 388);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$1, 7, 2, 218);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$1, 15, 4, 473);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$1, 21, 2, 619);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$1, 13, 2, 443);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$1, 39, 2, 1200);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$1, 40, 2, 1224);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$1, 41, 2, 1261);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$1, 42, 2, 1328);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$1, 95, 4, 2669);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$1, 94, 2, 2637);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$1, 97, 2, 2750);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$1, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h40);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(p0, br);
    			append_dev(p0, t3);
    			append_dev(div, t4);
    			append_dev(div, pre0);
    			append_dev(pre0, b0);
    			append_dev(pre0, t6);
    			append_dev(pre0, b1);
    			append_dev(pre0, t8);
    			append_dev(div, t9);
    			append_dev(div, hr);
    			append_dev(div, t10);
    			append_dev(div, h41);
    			append_dev(div, t12);
    			append_dev(div, p1);
    			append_dev(div, t14);
    			append_dev(div, pre1);
    			append_dev(div, t16);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t18);
    			append_dev(div, pre2);
    			append_dev(div, t20);
    			mount_component(scr_pagefooter, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_RouterStoreProperties", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouterStoreProperties> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SCR_PageFooter, SCR_PushRouteButton });
    	return [];
    }

    class SCR_RouterStoreProperties extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouterStoreProperties",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var SCR_RouterStoreProperties$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouterStoreProperties
    });

    /* src/docs/pages/SCR_Test1.svelte generated by Svelte v3.37.0 */
    const file = "src/docs/pages/SCR_Test1.svelte";

    // (37:2) <SCR_ROUTER_LINK to={{ path: `/svelte-client-router/${nextParam}/test1` }}>
    function create_default_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test Route With Param";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file, 37, 4, 1041);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(37:2) <SCR_ROUTER_LINK to={{ path: `/svelte-client-router/${nextParam}/test1` }}>",
    		ctx
    	});

    	return block;
    }

    // (55:2) <SCR_PageFooter>
    function create_default_slot(ctx) {
    	let div1;
    	let div0;
    	let scr_pushroutebutton0;
    	let t;
    	let scr_pushroutebutton1;
    	let current;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "routerStorePropertiesRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right; opacity: 0.5",
    				text: "Next",
    				routeName: "test1Route",
    				title: "More content to be added"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			create_component(scr_pushroutebutton1.$$.fragment);
    			attr_dev(div0, "class", "col");
    			add_location(div0, file, 56, 6, 1531);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file, 55, 4, 1507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton0, div0, null);
    			append_dev(div0, t);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_pushroutebutton0.$$.fragment, local);
    			transition_in(scr_pushroutebutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_pushroutebutton0.$$.fragment, local);
    			transition_out(scr_pushroutebutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(55:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let h4;
    	let t1;
    	let p;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let b;
    	let t5_value = /*pathParams*/ ctx[0].teste + "";
    	let t5;
    	let t6;
    	let br2;
    	let t7;
    	let br3;
    	let t8;
    	let t9;
    	let div0;
    	let label;
    	let t11;
    	let input;
    	let t12;
    	let scr_router_link;
    	let t13;
    	let hr;
    	let t14;
    	let center;
    	let small;
    	let t16;
    	let pre;
    	let t18;
    	let scr_pagefooter;
    	let current;
    	let mounted;
    	let dispose;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: {
    					path: `/svelte-client-router/${/*nextParam*/ ctx[1]}/test1`
    				},
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Test 1";
    			t1 = space();
    			p = element("p");
    			t2 = text("This route tests regex param path.\n    ");
    			br0 = element("br");
    			t3 = space();
    			br1 = element("br");
    			t4 = text("\n    The route param path passed is: ");
    			b = element("b");
    			t5 = text(t5_value);
    			t6 = space();
    			br2 = element("br");
    			t7 = space();
    			br3 = element("br");
    			t8 = text("\n    Try it!");
    			t9 = space();
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "Route Param";
    			t11 = space();
    			input = element("input");
    			t12 = space();
    			create_component(scr_router_link.$$.fragment);
    			t13 = space();
    			hr = element("hr");
    			t14 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t16 = space();
    			pre = element("pre");
    			pre.textContent = "{\n  name: \"test1Route\",\n  path: \"/svelte-client-router/:teste/test1\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_Test1.svelte\"),\n  title: \"SCR - Test 1\",\n  forceReload: true\n}";
    			t18 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file, 16, 2, 471);
    			add_location(br0, file, 19, 4, 576);
    			add_location(br1, file, 20, 4, 587);
    			add_location(b, file, 21, 36, 630);
    			add_location(br2, file, 22, 4, 660);
    			add_location(br3, file, 23, 4, 671);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file, 17, 2, 504);
    			attr_dev(label, "for", "scr-next-param");
    			attr_dev(label, "class", "form-label");
    			add_location(label, file, 27, 4, 722);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control form-control-sm");
    			attr_dev(input, "id", "scr-next-param");
    			attr_dev(input, "placeholder", ":teste");
    			add_location(input, file, 28, 4, 793);
    			attr_dev(div0, "class", "mb-3");
    			add_location(div0, file, 26, 2, 699);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file, 39, 2, 1113);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file, 41, 4, 1169);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file, 40, 2, 1137);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file, 43, 2, 1250);
    			attr_dev(div1, "class", "scr-page");
    			add_location(div1, file, 15, 0, 446);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h4);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(p, br0);
    			append_dev(p, t3);
    			append_dev(p, br1);
    			append_dev(p, t4);
    			append_dev(p, b);
    			append_dev(b, t5);
    			append_dev(p, t6);
    			append_dev(p, br2);
    			append_dev(p, t7);
    			append_dev(p, br3);
    			append_dev(p, t8);
    			append_dev(div1, t9);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(div0, t11);
    			append_dev(div0, input);
    			set_input_value(input, /*nextParam*/ ctx[1]);
    			append_dev(div1, t12);
    			mount_component(scr_router_link, div1, null);
    			append_dev(div1, t13);
    			append_dev(div1, hr);
    			append_dev(div1, t14);
    			append_dev(div1, center);
    			append_dev(center, small);
    			append_dev(div1, t16);
    			append_dev(div1, pre);
    			append_dev(div1, t18);
    			mount_component(scr_pagefooter, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*pathParams*/ 1) && t5_value !== (t5_value = /*pathParams*/ ctx[0].teste + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*nextParam*/ 2 && input.value !== /*nextParam*/ ctx[1]) {
    				set_input_value(input, /*nextParam*/ ctx[1]);
    			}

    			const scr_router_link_changes = {};

    			if (dirty & /*nextParam*/ 2) scr_router_link_changes.to = {
    				path: `/svelte-client-router/${/*nextParam*/ ctx[1]}/test1`
    			};

    			if (dirty & /*$$scope*/ 16) {
    				scr_router_link_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link.$set(scr_router_link_changes);
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				scr_pagefooter_changes.$$scope = { dirty, ctx };
    			}

    			scr_pagefooter.$set(scr_pagefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scr_router_link.$$.fragment, local);
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_link.$$.fragment, local);
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(scr_router_link);
    			destroy_component(scr_pagefooter);
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
    	validate_slots("SCR_Test1", slots, []);
    	let { pathParams } = $$props;
    	let nextParam = "";
    	let regex = /[A-Za-zÀ-ú0-9]/g;
    	const writable_props = ["pathParams"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Test1> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		nextParam = this.value;
    		($$invalidate(1, nextParam), $$invalidate(3, regex));
    	}

    	$$self.$$set = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    	};

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton,
    		pathParams,
    		nextParam,
    		regex
    	});

    	$$self.$inject_state = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    		if ("nextParam" in $$props) $$invalidate(1, nextParam = $$props.nextParam);
    		if ("regex" in $$props) $$invalidate(3, regex = $$props.regex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*nextParam*/ 2) {
    			if (nextParam) {
    				const match = nextParam.match(regex);
    				const value = match ? match.join("").substr(0, 100) + "" : "";
    				$$invalidate(1, nextParam = value);
    			}
    		}
    	};

    	return [pathParams, nextParam, input_input_handler];
    }

    class SCR_Test1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { pathParams: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Test1",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pathParams*/ ctx[0] === undefined && !("pathParams" in props)) {
    			console.warn("<SCR_Test1> was created without expected prop 'pathParams'");
    		}
    	}

    	get pathParams() {
    		throw new Error("<SCR_Test1>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pathParams(value) {
    		throw new Error("<SCR_Test1>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SCR_Test1$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_Test1
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
