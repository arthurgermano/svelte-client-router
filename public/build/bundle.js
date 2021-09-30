
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
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
    const ANY_ROUTE_PARAM_CHAR = "*";

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
    // -----------------  function getFindAnyRouteFunc  ----------------------------------

    function getFindAnyRouteFunc(path) {
      let anyRoute;
      let foundRoute;

      // adding trailing slash to route or not
      const hasTrailingSlash = getTrailingSlash();

      let realPath = path.toString();

      if (configStore.getHashMode()) {
        realPath = realPath.split("?");
        realPath = realPath[0];
      }
      if (realPath.substring(realPath.length - 1) != "/") {
        realPath += hasTrailingSlash;
      }

      const pathDefArr = realPath.split("/");
      for (let routeItem of routerStore.getRoutes()) {

        // if the route does not include the CHAR then it should not
        // considerate and just go forwarding searching in other routes
        if (!routeItem.path.includes(ANY_ROUTE_PARAM_CHAR)) {
          continue;
        }

        // if it is equal - the programmer defined a any route wildcard for all routes
        // but we must continue searching for any other more suitable routes
        if (routeItem.path === ANY_ROUTE_PARAM_CHAR) {
          anyRoute = routeItem;
          continue;
        }

        // searching by route section
        const routeDefArr = (routeItem.path + hasTrailingSlash).split("/");
        if (routeDefArr.length != pathDefArr.length) {
          continue;
        }

        let hasMatched = true;
        for (let key in routeDefArr) {

          // if the section contains the ANY CHAR it should considerate as prefix
          if (routeDefArr[key].includes(ANY_ROUTE_PARAM_CHAR)) {
            const routePartLength = routeDefArr[key].length - 1;
            if (
              routeDefArr[key].substring(0, routePartLength) !=
              pathDefArr[key].substring(0, routePartLength)
            ) {
              hasMatched = false;
              break;
            }
          // if the section does not contain PATH param and it is differente
          // this route is not a match stop searching this route and go to the next
          } else if (
            routeDefArr[key] != pathDefArr[key] &&
            !routeDefArr[key].includes(":")
          ) {
            hasMatched = false;
            break;
          } 
        }

        // if a route was found then it should stop searching
        if (hasMatched) {
          foundRoute = routeItem;
          break;
        }
      }

      // anyRoute will contain the result of the most suitable route found
      if (foundRoute) {
        anyRoute = foundRoute;
      }

      // if we found a route then we have to tweak a little be to adapt to the part of the code
      if (anyRoute) {
        anyRoute = assign({}, anyRoute);
        anyRoute.params = {
          ...anyRoute.params,
          pathParams : getPathParams(path, anyRoute.path),
        };
        anyRoute.path = path;

        return anyRoute;
      }

      return false;
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
        realPath += hasTrailingSlash;
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
      
      let realPath = path.toString().split("?");
      realPath = realPath[0];

      let pathParams = {};
      const hasTrailingSlash = getTrailingSlash();

      routePath += hasTrailingSlash;
      const routeDefArr = routePath.split("/");
      const pathDefArr = realPath.split("/");

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
        queryParams = getQueryParamsFromPath(currentLocation.pathname);
      }

      return queryParams;
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function getQueryParamsFromPath  -------------------------------

    function getQueryParamsFromPath(path = "") {
      if (!path) {
        return {};
      }
      let queryArr = path.toString().split("?");
      if (!queryArr || !queryArr[1]) {
        return {};
      }
      queryArr = queryArr[1].split("&");
      let queryParams = {};
      let splitItem;
      for (let item of queryArr) {
        splitItem = item.split("=");
        if (splitItem && splitItem[0] && splitItem[1]) {
          queryParams = {
            ...queryParams,
            [splitItem[0]]: splitItem[1],
          };
        }
      }
      return queryParams;
    }

    // -----------------------------------------------------------------------------------
    // -----------------  function getQueryParamsToPath  ---------------------------------

    function getQueryParamsToPath(currentLocation) {
      if (
        !currentLocation ||
        typeof currentLocation != "object" ||
        currentLocation.pathname.includes("?")
      ) {
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
        params = {
          ...params,
          queryParams: {
            ...getQueryParamsFromPath(route)
          }
        };
      } else if (route.path) {
        routeNavigation = routes.find(getFindRouteFunc(route.path, realParamPath));
        params = {
          ...params,
          queryParams: {
            ...getQueryParamsFromPath(route.path)
          }
        };
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
    const file$x = "src/components/SCR_NotFound.svelte";

    function create_fragment$z(ctx) {
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
    			add_location(p0, file$x, 5, 2, 82);
    			attr_dev(p1, "class", "scr-p-small svelte-zj7cmj");
    			add_location(p1, file$x, 6, 2, 115);
    			add_location(center, file$x, 4, 0, 71);
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
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_NotFound",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* src/components/SCR_Loading.svelte generated by Svelte v3.37.0 */

    const file$w = "src/components/SCR_Loading.svelte";

    function create_fragment$y(ctx) {
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
    			add_location(div0, file$w, 6, 4, 125);
    			attr_dev(div1, "class", "svelte-146mxqr");
    			add_location(div1, file$w, 7, 4, 137);
    			attr_dev(div2, "class", "svelte-146mxqr");
    			add_location(div2, file$w, 8, 4, 149);
    			attr_dev(div3, "class", "svelte-146mxqr");
    			add_location(div3, file$w, 9, 4, 161);
    			attr_dev(div4, "class", "svelte-146mxqr");
    			add_location(div4, file$w, 10, 4, 173);
    			attr_dev(div5, "class", "svelte-146mxqr");
    			add_location(div5, file$w, 11, 4, 185);
    			attr_dev(div6, "class", "svelte-146mxqr");
    			add_location(div6, file$w, 12, 4, 197);
    			attr_dev(div7, "class", "svelte-146mxqr");
    			add_location(div7, file$w, 13, 4, 209);
    			attr_dev(div8, "class", "svelte-146mxqr");
    			add_location(div8, file$w, 14, 4, 221);
    			attr_dev(div9, "class", "svelte-146mxqr");
    			add_location(div9, file$w, 15, 4, 233);
    			attr_dev(div10, "class", "svelte-146mxqr");
    			add_location(div10, file$w, 16, 4, 245);
    			attr_dev(div11, "class", "svelte-146mxqr");
    			add_location(div11, file$w, 17, 4, 257);
    			attr_dev(div12, "class", "scr-lds-spinner svelte-146mxqr");
    			add_location(div12, file$w, 5, 2, 91);
    			attr_dev(h1, "class", "scr-h1 svelte-146mxqr");
    			add_location(h1, file$w, 19, 2, 276);
    			attr_dev(center, "class", "scr-center svelte-146mxqr");
    			add_location(center, file$w, 4, 0, 61);
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
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
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

    class SCR_Loading$2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { loadingText: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Loading",
    			options,
    			id: create_fragment$y.name
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

    const file$v = "src/components/SCR_Error.svelte";

    function create_fragment$x(ctx) {
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
    			add_location(p0, file$v, 5, 2, 84);
    			attr_dev(p1, "class", "scr-p-small svelte-jhjhwz");
    			add_location(p1, file$v, 6, 2, 113);
    			add_location(center, file$v, 4, 0, 73);
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
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { errorMessage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Error",
    			options,
    			id: create_fragment$x.name
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

    const file$u = "src/components/SCR_Layout.svelte";
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
    			add_location(h1, file$u, 2, 4, 62);
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

    function create_fragment$w(ctx) {
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
    			add_location(main, file$u, 0, 0, 0);
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
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Layout",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    /* src/components/SCR_Router.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1, console: console_1$2 } = globals;

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

    // (647:0) {:then value}
    function create_then_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$configStore*/ ctx[0].usesRouteLayout && typeof /*layoutComponent*/ ctx[5] === "function") return 0;
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
    		source: "(647:0) {:then value}",
    		ctx
    	});

    	return block;
    }

    // (652:2) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[1]];
    	var switch_value = /*currentComponent*/ ctx[3];

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
    			const switch_instance_changes = (dirty[0] & /*props*/ 2)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[1])])
    			: {};

    			if (switch_value !== (switch_value = /*currentComponent*/ ctx[3])) {
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
    		source: "(652:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (648:2) {#if $configStore.usesRouteLayout && typeof layoutComponent === "function"}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[1]];
    	var switch_value = /*layoutComponent*/ ctx[5];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$l] },
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
    			const switch_instance_changes = (dirty[0] & /*props*/ 2)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[1])])
    			: {};

    			if (dirty[0] & /*currentComponent, props*/ 10 | dirty[1] & /*$$scope*/ 4) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*layoutComponent*/ ctx[5])) {
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
    		source: "(648:2) {#if $configStore.usesRouteLayout && typeof layoutComponent === \\\"function\\\"}",
    		ctx
    	});

    	return block;
    }

    // (649:4) <svelte:component this={layoutComponent} {...props}>
    function create_default_slot$l(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[1]];
    	var switch_value = /*currentComponent*/ ctx[3];

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
    			const switch_instance_changes = (dirty[0] & /*props*/ 2)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[1])])
    			: {};

    			if (switch_value !== (switch_value = /*currentComponent*/ ctx[3])) {
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
    		id: create_default_slot$l.name,
    		type: "slot",
    		source: "(649:4) <svelte:component this={layoutComponent} {...props}>",
    		ctx
    	});

    	return block;
    }

    // (645:23)    <svelte:component this={SCR_LoadingComponent}
    function create_pending_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*loadingProps*/ ctx[2], /*props*/ ctx[1]];
    	var switch_value = /*SCR_LoadingComponent*/ ctx[6];

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
    			const switch_instance_changes = (dirty[0] & /*loadingProps, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*loadingProps*/ 4 && get_spread_object(/*loadingProps*/ ctx[2]),
    					dirty[0] & /*props*/ 2 && get_spread_object(/*props*/ ctx[1])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*SCR_LoadingComponent*/ ctx[6])) {
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
    		source: "(645:23)    <svelte:component this={SCR_LoadingComponent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
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
    		value: 32,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*loadingPromise*/ ctx[4], info);

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
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty[0] & /*loadingPromise*/ 16 && promise !== (promise = /*loadingPromise*/ ctx[4]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[32] = info.resolved;
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
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const BACKING_MODE = 1;
    const FORWARDING_MODE = 2;

    function instance$v($$self, $$props, $$invalidate) {
    	let $configStore;
    	let $routerStore;
    	let $navigateStore;
    	validate_store(configStore, "configStore");
    	component_subscribe($$self, configStore, $$value => $$invalidate(0, $configStore = $$value));
    	validate_store(routerStore, "routerStore");
    	component_subscribe($$self, routerStore, $$value => $$invalidate(14, $routerStore = $$value));
    	validate_store(navigateStore, "navigateStore");
    	component_subscribe($$self, navigateStore, $$value => $$invalidate(15, $navigateStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Router", slots, []);
    	let { routes } = $$props;
    	let { notFoundComponent = SCR_NotFound$1 } = $$props;
    	let { errorComponent = SCR_Error$1 } = $$props;
    	let { defaultLayoutComponent = SCR_Layout$1 } = $$props;
    	let { loadingComponent = SCR_Loading$2 } = $$props;
    	let { allProps = {} } = $$props;
    	let { allLoadingProps = {} } = $$props;
    	let props = {};
    	let loadingProps = {};
    	let currentComponent;
    	let currentLocation;
    	let loadingPromise;
    	let layoutComponent = defaultLayoutComponent;
    	let loadingController$1 = new loadingController();
    	let isPushed = false;
    	let SCR_LoadingComponent = loadingComponent;
    	let SCR_State = { sequence: { prev: 0, curr: 0 } };

    	// -----------------------------------------------------------------------------------
    	// -----------------  function pushRoute  --------------------------------------------
    	function pushRoute(routePath, popEvent = true) {
    		routePath = ($configStore.hashMode ? "#" : "") + routePath;

    		if (history.pushState && !isPushed) {
    			SCR_State.sequence = {
    				prev: SCR_State.sequence.curr,
    				curr: SCR_State.sequence.curr + 1
    			};

    			history.pushState({ sequence: SCR_State.sequence }, null, routePath);
    		} else {
    			if ($configStore.hashMode) {
    				location.hash = routePath + getQueryParamsToPath(currentLocation);
    			}
    		}

    		isPushed = false;

    		if (popEvent) {
    			window.dispatchEvent(new Event("popstate"));
    		}
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function getRouteParams  ---------------------------------------
    	function getRouteParams(routeObj, customParams) {
    		$$invalidate(1, props = {});

    		if (routeObj) {
    			$$invalidate(1, props = {
    				payload: routeObj.payload,
    				...routeObj.params || {},
    				...assign({}, allProps),
    				pathParams: {
    					...routeObj?.params?.pathParams || {},
    					...getPathParams(currentLocation.pathname, routeObj.path)
    				},
    				queryParams: {
    					...routeObj?.params?.queryParams || {},
    					...getQueryParams(currentLocation)
    				}
    			});
    		}

    		$$invalidate(1, props = {
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
    		$$invalidate(3, currentComponent = errorComponent);
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
    	// -----------------  function setLayoutComponent  -----------------------------------
    	async function setLayoutComponent(routeObj) {
    		if ($configStore.usesRouteLayout && !routeObj.ignoreLayout) {
    			// if is lazy loading component layout component
    			if (typeof routeObj.lazyLoadLayoutComponent === "function") {
    				const loadedLayoutComponent = await routeObj.lazyLoadLayoutComponent();

    				if (loadedLayoutComponent && loadedLayoutComponent.default) {
    					$$invalidate(5, layoutComponent = loadedLayoutComponent.default);
    					return;
    				}
    			}

    			if (routeObj.layoutComponent) {
    				$$invalidate(5, layoutComponent = routeObj.layoutComponent);
    			} else {
    				$$invalidate(5, layoutComponent = defaultLayoutComponent);
    			}
    		} else {
    			$$invalidate(5, layoutComponent = false);
    		}
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function setComponent  -----------------------------------------
    	async function setComponent(routeObj) {
    		// if is lazy loading component now is the time to load
    		if (typeof routeObj.lazyLoadComponent === "function") {
    			const loadedComponent = await routeObj.lazyLoadComponent();

    			if (loadedComponent && loadedComponent.default) {
    				$$invalidate(3, currentComponent = loadedComponent.default);
    				return;
    			}
    		}

    		if (typeof routeObj.component === "function") {
    			$$invalidate(3, currentComponent = routeObj.component);
    			return;
    		}

    		throw new Error(`No valid component defined for ${routeObj.name || "Route"} - ${routeObj.path || "Path"}!`);
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function setLoadingComponent  ----------------------------------
    	async function setLoadingComponent(routeObj) {
    		// if is lazy loading component now is the time to load
    		if (typeof routeObj.lazyLoadLoadingComponent === "function") {
    			const loadedComponent = await routeObj.lazyLoadLoadingComponent();

    			if (loadedComponent && loadedComponent.default) {
    				$$invalidate(6, SCR_LoadingComponent = loadedComponent.default);
    				return;
    			}
    		}

    		if (typeof routeObj.loadingComponent === "function") {
    			$$invalidate(6, SCR_LoadingComponent = routeObj.loadingComponent);
    			return;
    		} else {
    			$$invalidate(6, SCR_LoadingComponent = loadingComponent);
    		}
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function hasRoute  ---------------------------------------------
    	async function hasRoute(routeObj) {
    		if (routeObj && !routeObj.notFound) {
    			return true;
    		}

    		routeObj = getFindAnyRouteFunc(currentLocation.pathname);

    		if (routeObj) {
    			return routeObj;
    		}

    		if (currentLocation.pathname.includes($configStore.errorRoute)) {
    			// when trying to navigate to error route
    			$$invalidate(3, currentComponent = errorComponent);

    			await routerStore.setCurrentLocation(currentLocation.pathname);
    			pushRoute(currentLocation.pathname, false);
    			return false;
    		}

    		$$invalidate(3, currentComponent = notFoundComponent);

    		if (routeObj && routeObj.notFound) {
    			// when navigate tries to find a route passed wrongly or not existent!
    			await routerStore.setCurrentLocation(routeObj.path);

    			pushRoute($configStore.notFoundRoute, false);
    			return false;
    		}

    		// if current pathname is different not found route definition
    		if (currentLocation.pathname != $configStore.notFoundRoute) {
    			// we have to replace this route with not found
    			// to prevent problems with back button
    			window.history.replaceState(null, "", $configStore.notFoundRoute);

    			await routerStore.setCurrentLocation(currentLocation.pathname);
    		} // since we are replacing state - we replace the wrong not found route
    		// with not found route.

    		return false;
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function setSCRState  ------------------------------------------
    	function setSCRState() {
    		SCR_State.last = SCR_State.current;
    		SCR_State.current = currentLocation;
    	}

    	// -----------------------------------------------------------------------------------
    	// -----------------  function loadRoute  --------------------------------------------
    	async function loadRoute(routeObj, isLoading = true) {
    		try {
    			// if it is to reload current route if is redirected to the same route
    			if (routeObj && !routeObj.forceReload && currentLocation && currentLocation.pathname === routeObj.path) {
    				return;
    			}

    			// updating location
    			currentLocation = getLocation(routeObj);

    			setSCRState();

    			// cleaning component for later check if the route has a custom one
    			$$invalidate(5, layoutComponent = false);

    			// on error redirects to error and then enters here
    			if (currentLocation.pathname === $configStore.errorRoute) {
    				$$invalidate(3, currentComponent = errorComponent);
    				return;
    			}

    			// searching route from routes definition if not defined
    			if (!routeObj) {
    				routeObj = $routerStore.routes.find(getFindRouteFunc(currentLocation.pathname));
    			}

    			// checking if it has found a valid route.
    			// if not try to find any route declare with anyRouteChar
    			const hasFoundRoute = await hasRoute(routeObj);

    			if (typeof hasFoundRoute === "object") {
    				routeObj = hasFoundRoute;
    			} else if (!hasFoundRoute) {
    				// route not found - it was must redirect to NOT FOUND
    				return;
    			}

    			getRouteParams(routeObj);
    			await setLoadingComponent(routeObj);

    			// updating current location on the router
    			await routerStore.setCurrentLocation(currentLocation.pathname);

    			// setting loading property and start loading screen
    			$$invalidate(4, loadingPromise = loadingController$1.startLoading());

    			$$invalidate(2, loadingProps = { ...assign({}, allLoadingProps), ...props });

    			// adding route params to loading props
    			if (routeObj.loadingProps) {
    				$$invalidate(2, loadingProps = {
    					...loadingProps,
    					...routeObj.loadingProps,
    					...props
    				});
    			}

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
    			// console.log(error);
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
    		if (isPushed == BACKING_MODE) {
    			await routerStore.popNavigationHistory();
    		} else {
    			await routerStore.pushNavigationHistory($routerStore.currentRoute);
    		}

    		await routerStore.setFromRoute($routerStore.currentRoute);
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

    		// setting Layout
    		await setLayoutComponent(routeObj);

    		// setting Component
    		await setComponent(routeObj);

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

    			$$invalidate(3, currentComponent = errorComponent);
    			return error;
    		}

    		// loading route
    		isPushed = false;

    		await loadRoute();
    	});

    	// -----------------------------------------------------------------------------------
    	// -----------------  Window - eventListener popstate  -------------------------------
    	window.addEventListener("popstate", async event => {
    		const hasStateSequence = event.state && event.state.sequence;
    		isPushed = BACKING_MODE;

    		// checking if is a known route - if it has the state object
    		// then the route was accessed in some time and should not push
    		// a new route into history
    		// if it is null then is an user entered route via url!
    		if (hasStateSequence) {
    			if (event.state.sequence.curr != SCR_State.sequence.prev) {
    				// going forward button
    				isPushed = FORWARDING_MODE;
    			} else if (event.state.sequence.prev != SCR_State.sequence.curr) {
    				// going back button
    				isPushed = BACKING_MODE;
    			}
    		} else if (event.state && event.state.SCR_Replace) {
    			isPushed = BACKING_MODE;
    		}

    		if (isPushed && hasStateSequence) {
    			SCR_State.sequence = event.state.sequence;
    		}

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
    		if ("loadingComponent" in $$props) $$invalidate(11, loadingComponent = $$props.loadingComponent);
    		if ("allProps" in $$props) $$invalidate(12, allProps = $$props.allProps);
    		if ("allLoadingProps" in $$props) $$invalidate(13, allLoadingProps = $$props.allLoadingProps);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		assign,
    		loadFromStorage,
    		getBeforeEnterAsArray,
    		getFindAnyRouteFunc,
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
    		SCR_Loading: SCR_Loading$2,
    		SCR_Error: SCR_Error$1,
    		SCR_Layout: SCR_Layout$1,
    		routes,
    		notFoundComponent,
    		errorComponent,
    		defaultLayoutComponent,
    		loadingComponent,
    		allProps,
    		allLoadingProps,
    		BACKING_MODE,
    		FORWARDING_MODE,
    		props,
    		loadingProps,
    		currentComponent,
    		currentLocation,
    		loadingPromise,
    		layoutComponent,
    		loadingController: loadingController$1,
    		isPushed,
    		SCR_LoadingComponent,
    		SCR_State,
    		pushRoute,
    		getRouteParams,
    		setErrorComponent,
    		throwRouteError,
    		setLayoutComponent,
    		setComponent,
    		setLoadingComponent,
    		hasRoute,
    		setSCRState,
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
    		if ("loadingComponent" in $$props) $$invalidate(11, loadingComponent = $$props.loadingComponent);
    		if ("allProps" in $$props) $$invalidate(12, allProps = $$props.allProps);
    		if ("allLoadingProps" in $$props) $$invalidate(13, allLoadingProps = $$props.allLoadingProps);
    		if ("props" in $$props) $$invalidate(1, props = $$props.props);
    		if ("loadingProps" in $$props) $$invalidate(2, loadingProps = $$props.loadingProps);
    		if ("currentComponent" in $$props) $$invalidate(3, currentComponent = $$props.currentComponent);
    		if ("currentLocation" in $$props) currentLocation = $$props.currentLocation;
    		if ("loadingPromise" in $$props) $$invalidate(4, loadingPromise = $$props.loadingPromise);
    		if ("layoutComponent" in $$props) $$invalidate(5, layoutComponent = $$props.layoutComponent);
    		if ("loadingController" in $$props) loadingController$1 = $$props.loadingController;
    		if ("isPushed" in $$props) isPushed = $$props.isPushed;
    		if ("SCR_LoadingComponent" in $$props) $$invalidate(6, SCR_LoadingComponent = $$props.SCR_LoadingComponent);
    		if ("SCR_State" in $$props) SCR_State = $$props.SCR_State;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$configStore, $routerStore*/ 16385) {
    			// -----------------------------------------------------------------------------------
    			// -----------------  svelte_reactive - $configStore.consoleLogStores  ---------------
    			if ($configStore.consoleLogStores && $routerStore) {
    				console.log(" ----- SCR - Router Store ------------ ");
    				console.log($routerStore);
    				console.log(" ------------------------------------- ");
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$configStore*/ 1) {
    			if ($configStore.consoleLogStores && $configStore) {
    				console.log(" ----- SCR - Configuration Store ----- ");
    				console.log($configStore);
    				console.log(" ------------------------------------- ");
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$configStore, $navigateStore*/ 32769) {
    			if ($configStore.consoleLogStores && $navigateStore) {
    				console.log(" ----- SCR - Navigate Store ---------- ");
    				console.log($navigateStore);
    				console.log(" ------------------------------------- ");
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$navigateStore*/ 32768) {
    			// -----------------------------------------------------------------------------------
    			// -----------------  svelte_reactive - $navigateStore.pushRoute  --------------------
    			if ($navigateStore.pushRoute) {
    				isPushed = false;
    				loadRoute(navigateStore.consumeRoutePushed(), false);
    			}
    		}
    	};

    	return [
    		$configStore,
    		props,
    		loadingProps,
    		currentComponent,
    		loadingPromise,
    		layoutComponent,
    		SCR_LoadingComponent,
    		routes,
    		notFoundComponent,
    		errorComponent,
    		defaultLayoutComponent,
    		loadingComponent,
    		allProps,
    		allLoadingProps,
    		$routerStore,
    		$navigateStore
    	];
    }

    class SCR_Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$v,
    			create_fragment$v,
    			safe_not_equal,
    			{
    				routes: 7,
    				notFoundComponent: 8,
    				errorComponent: 9,
    				defaultLayoutComponent: 10,
    				loadingComponent: 11,
    				allProps: 12,
    				allLoadingProps: 13
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Router",
    			options,
    			id: create_fragment$v.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*routes*/ ctx[7] === undefined && !("routes" in props)) {
    			console_1$2.warn("<SCR_Router> was created without expected prop 'routes'");
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
    const file$t = "src/components/SCR_RouterLink.svelte";

    function create_fragment$u(ctx) {
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
    			add_location(div, file$t, 17, 0, 393);
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
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			props: 2,
    			onError: 3,
    			to: 4,
    			elementProps: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouterLink",
    			options,
    			id: create_fragment$u.name
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

    /* docsproj/components/SCR_Menu.svelte generated by Svelte v3.37.0 */
    const file$s = "docsproj/components/SCR_Menu.svelte";

    // (7:2) <SCR_ROUTER_LINK to={{ name: "rootRoute" }}>
    function create_default_slot_20(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Presentation";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 7, 4, 194);
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
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(7:2) <SCR_ROUTER_LINK to={{ name: \\\"rootRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (10:2) <SCR_ROUTER_LINK to={{ name: "installationRoute" }}>
    function create_default_slot_19(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Installation";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 10, 4, 314);
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
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(10:2) <SCR_ROUTER_LINK to={{ name: \\\"installationRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (13:2) <SCR_ROUTER_LINK to={{ name: "gettingStartedRoute" }}>
    function create_default_slot_18(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Getting Started";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 13, 4, 436);
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
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(13:2) <SCR_ROUTER_LINK to={{ name: \\\"gettingStartedRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (17:2) <SCR_ROUTER_LINK to={{ name: "configurationOptionsRoute" }}>
    function create_default_slot_17(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Configuration Options";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 17, 4, 612);
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
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(17:2) <SCR_ROUTER_LINK to={{ name: \\\"configurationOptionsRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (20:2) <SCR_ROUTER_LINK to={{ name: "configurationGlobalBeforeEnterOptionRoute" }}>
    function create_default_slot_16(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Global Before Enter";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 20, 4, 765);
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
    		source: "(20:2) <SCR_ROUTER_LINK to={{ name: \\\"configurationGlobalBeforeEnterOptionRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <SCR_ROUTER_LINK to={{ name: "configurationOnErrorOptionRoute" }}>
    function create_default_slot_15(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Global On Error";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 23, 4, 906);
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
    		source: "(23:2) <SCR_ROUTER_LINK to={{ name: \\\"configurationOnErrorOptionRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (27:2) <SCR_ROUTER_LINK to={{ name: "routeObjectOptionsRoute" }}>
    function create_default_slot_14(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Properties";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 27, 4, 1079);
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
    		source: "(27:2) <SCR_ROUTER_LINK to={{ name: \\\"routeObjectOptionsRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (30:2) <SCR_ROUTER_LINK to={{ name: "routeObjectBeforeEnterRoute" }}>
    function create_default_slot_13(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Before Enter";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 30, 4, 1207);
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
    		source: "(30:2) <SCR_ROUTER_LINK to={{ name: \\\"routeObjectBeforeEnterRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (33:2) <SCR_ROUTER_LINK to={{ name: "routeObjectAfterBeforeEnterRoute" }}>
    function create_default_slot_12(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "After Before Enter";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 33, 4, 1342);
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
    		source: "(33:2) <SCR_ROUTER_LINK to={{ name: \\\"routeObjectAfterBeforeEnterRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (36:2) <SCR_ROUTER_LINK to={{ name: "routeObjectOnErrorRoute" }}>
    function create_default_slot_11(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "On Error";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 36, 4, 1474);
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
    		source: "(36:2) <SCR_ROUTER_LINK to={{ name: \\\"routeObjectOnErrorRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (40:2) <SCR_ROUTER_LINK to={{ name: "routeComponentPropertiesRoute" }}>
    function create_default_slot_10(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Properties";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 40, 4, 1649);
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
    		source: "(40:2) <SCR_ROUTER_LINK to={{ name: \\\"routeComponentPropertiesRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (43:2) <SCR_ROUTER_LINK to={{ name: "routeComponentComponentsRoute" }}>
    function create_default_slot_9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Components";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 43, 4, 1779);
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
    		source: "(43:2) <SCR_ROUTER_LINK to={{ name: \\\"routeComponentComponentsRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (47:2) <SCR_ROUTER_LINK to={{ name: "navigationRoutingRoute" }}>
    function create_default_slot_8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Routing";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 47, 4, 1944);
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
    		source: "(47:2) <SCR_ROUTER_LINK to={{ name: \\\"navigationRoutingRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (50:2) <SCR_ROUTER_LINK to={{ name: "navigationStoreRoute" }}>
    function create_default_slot_7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Store";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 50, 4, 2062);
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
    		source: "(50:2) <SCR_ROUTER_LINK to={{ name: \\\"navigationStoreRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (54:2) <SCR_ROUTER_LINK to={{ name: "routerLinkPropertiesRoute" }}>
    function create_default_slot_6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Properties";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 54, 4, 2225);
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
    		source: "(54:2) <SCR_ROUTER_LINK to={{ name: \\\"routerLinkPropertiesRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (58:2) <SCR_ROUTER_LINK to={{ name: "routerStorePropertiesRoute" }}>
    function create_default_slot_5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Properties";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 58, 4, 2396);
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
    		source: "(58:2) <SCR_ROUTER_LINK to={{ name: \\\"routerStorePropertiesRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (62:2) <SCR_ROUTER_LINK to={{ name: "testRegexPathRoute" }}>
    function create_default_slot_4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test - Regex Path";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 62, 4, 2554);
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
    		source: "(62:2) <SCR_ROUTER_LINK to={{ name: \\\"testRegexPathRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (65:2) <SCR_ROUTER_LINK to={{ name: "testRegexPath2Route" }}>
    function create_default_slot_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test - Regex Path 2";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 65, 4, 2681);
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
    		source: "(65:2) <SCR_ROUTER_LINK to={{ name: \\\"testRegexPath2Route\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (68:2) <SCR_ROUTER_LINK to={{ name: "testLoadingComponentWithBeforeEnterRoute" }}>
    function create_default_slot_2$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test - Loading Component with Before Enter";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 68, 4, 2831);
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
    		source: "(68:2) <SCR_ROUTER_LINK to={{ name: \\\"testLoadingComponentWithBeforeEnterRoute\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (71:2) <SCR_ROUTER_LINK to={{ path: "/svelte-client-router/anyRouteWildcard/wildcardplacedhere/pathParamValueHere" }}>
    function create_default_slot_1$a(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test - Any Route Wildcard";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 71, 4, 3040);
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
    		id: create_default_slot_1$a.name,
    		type: "slot",
    		source: "(71:2) <SCR_ROUTER_LINK to={{ path: \\\"/svelte-client-router/anyRouteWildcard/wildcardplacedhere/pathParamValueHere\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (74:2) <SCR_ROUTER_LINK to={{ path: "/svelte-client-router/some_route_not_declared" }}>
    function create_default_slot$k(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test - Not Found";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file$s, 74, 4, 3201);
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
    		id: create_default_slot$k.name,
    		type: "slot",
    		source: "(74:2) <SCR_ROUTER_LINK to={{ path: \\\"/svelte-client-router/some_route_not_declared\\\" }}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
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
    	let t32;
    	let scr_router_link17;
    	let t33;
    	let scr_router_link18;
    	let t34;
    	let scr_router_link19;
    	let t35;
    	let scr_router_link20;
    	let current;

    	scr_router_link0 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "rootRoute" },
    				$$slots: { default: [create_default_slot_20] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link1 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "installationRoute" },
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link2 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "gettingStartedRoute" },
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link3 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "configurationOptionsRoute" },
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link4 = new SCR_ROUTER_LINK({
    			props: {
    				to: {
    					name: "configurationGlobalBeforeEnterOptionRoute"
    				},
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link5 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "configurationOnErrorOptionRoute" },
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link6 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectOptionsRoute" },
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link7 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectBeforeEnterRoute" },
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link8 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectAfterBeforeEnterRoute" },
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link9 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeObjectOnErrorRoute" },
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link10 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeComponentPropertiesRoute" },
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link11 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routeComponentComponentsRoute" },
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link12 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "navigationRoutingRoute" },
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link13 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "navigationStoreRoute" },
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link14 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routerLinkPropertiesRoute" },
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link15 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "routerStorePropertiesRoute" },
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link16 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "testRegexPathRoute" },
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link17 = new SCR_ROUTER_LINK({
    			props: {
    				to: { name: "testRegexPath2Route" },
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link18 = new SCR_ROUTER_LINK({
    			props: {
    				to: {
    					name: "testLoadingComponentWithBeforeEnterRoute"
    				},
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link19 = new SCR_ROUTER_LINK({
    			props: {
    				to: {
    					path: "/svelte-client-router/anyRouteWildcard/wildcardplacedhere/pathParamValueHere"
    				},
    				$$slots: { default: [create_default_slot_1$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_router_link20 = new SCR_ROUTER_LINK({
    			props: {
    				to: {
    					path: "/svelte-client-router/some_route_not_declared"
    				},
    				$$slots: { default: [create_default_slot$k] },
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
    			t32 = space();
    			create_component(scr_router_link17.$$.fragment);
    			t33 = space();
    			create_component(scr_router_link18.$$.fragment);
    			t34 = space();
    			create_component(scr_router_link19.$$.fragment);
    			t35 = space();
    			create_component(scr_router_link20.$$.fragment);
    			attr_dev(h40, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h40, file$s, 5, 2, 101);
    			attr_dev(h41, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h41, file$s, 15, 2, 502);
    			attr_dev(h42, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h42, file$s, 25, 2, 972);
    			attr_dev(h43, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h43, file$s, 38, 2, 1533);
    			attr_dev(h44, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h44, file$s, 45, 2, 1840);
    			attr_dev(h45, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h45, file$s, 52, 2, 2118);
    			attr_dev(h46, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h46, file$s, 56, 2, 2286);
    			attr_dev(h47, "class", "scr-menu-h4 svelte-1y3f1bo");
    			add_location(h47, file$s, 60, 2, 2457);
    			attr_dev(div, "class", "scr-menu svelte-1y3f1bo");
    			add_location(div, file$s, 4, 0, 76);
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
    			append_dev(div, t32);
    			mount_component(scr_router_link17, div, null);
    			append_dev(div, t33);
    			mount_component(scr_router_link18, div, null);
    			append_dev(div, t34);
    			mount_component(scr_router_link19, div, null);
    			append_dev(div, t35);
    			mount_component(scr_router_link20, div, null);
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
    			const scr_router_link17_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link17_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link17.$set(scr_router_link17_changes);
    			const scr_router_link18_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link18_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link18.$set(scr_router_link18_changes);
    			const scr_router_link19_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link19_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link19.$set(scr_router_link19_changes);
    			const scr_router_link20_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				scr_router_link20_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link20.$set(scr_router_link20_changes);
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
    			transition_in(scr_router_link17.$$.fragment, local);
    			transition_in(scr_router_link18.$$.fragment, local);
    			transition_in(scr_router_link19.$$.fragment, local);
    			transition_in(scr_router_link20.$$.fragment, local);
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
    			transition_out(scr_router_link17.$$.fragment, local);
    			transition_out(scr_router_link18.$$.fragment, local);
    			transition_out(scr_router_link19.$$.fragment, local);
    			transition_out(scr_router_link20.$$.fragment, local);
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
    			destroy_component(scr_router_link17);
    			destroy_component(scr_router_link18);
    			destroy_component(scr_router_link19);
    			destroy_component(scr_router_link20);
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
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Menu",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* docsproj/components/SCR_Layout.svelte generated by Svelte v3.37.0 */
    const file$r = "docsproj/components/SCR_Layout.svelte";
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
    			add_location(h2, file$r, 8, 6, 199);
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

    function create_fragment$s(ctx) {
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
    			t4 = text(" 1.3.6\n      ");
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
    			add_location(div0, file$r, 6, 2, 139);
    			attr_dev(div1, "class", "scr-pages svelte-lxpf7t");
    			add_location(div1, file$r, 15, 4, 369);
    			attr_dev(div2, "class", "scr-main svelte-lxpf7t");
    			add_location(div2, file$r, 13, 2, 325);
    			add_location(b0, file$r, 25, 6, 625);
    			add_location(br0, file$r, 26, 6, 662);
    			add_location(br1, file$r, 27, 6, 675);
    			add_location(b1, file$r, 28, 6, 688);
    			attr_dev(a0, "href", "https://en.wikipedia.org/wiki/MIT_License");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$r, 29, 6, 710);
    			attr_dev(div3, "class", "scr-footer-left");
    			add_location(div3, file$r, 24, 4, 589);
    			add_location(b2, file$r, 33, 6, 845);
    			attr_dev(a1, "href", "https://github.com/arthurgermano/svelte-client-router");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$r, 33, 21, 860);
    			add_location(br2, file$r, 37, 6, 1027);
    			add_location(br3, file$r, 38, 6, 1040);
    			add_location(b3, file$r, 39, 6, 1053);
    			attr_dev(a2, "href", "https://www.npmjs.com/package/svelte-client-router");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$r, 39, 18, 1065);
    			attr_dev(div4, "class", "scr-footer-right");
    			add_location(div4, file$r, 32, 4, 808);
    			attr_dev(div5, "class", "scr-footer svelte-lxpf7t");
    			add_location(div5, file$r, 23, 2, 560);
    			attr_dev(div6, "class", "scr-main-layout svelte-lxpf7t");
    			add_location(div6, file$r, 5, 0, 107);
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

    	$$self.$capture_state = () => ({ fly, SCR_Menu });
    	return [$$scope, slots];
    }

    class SCR_Layout extends SvelteComponentDev {
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

    /* docsproj/components/SCR_NotFound.svelte generated by Svelte v3.37.0 */
    const file$q = "docsproj/components/SCR_NotFound.svelte";

    function create_fragment$r(ctx) {
    	let center;
    	let p0;
    	let t1;
    	let p1;
    	let t2_value = (/*$routerStore*/ ctx[0].currentLocation || "='(") + "";
    	let t2;
    	let t3;
    	let br;
    	let t4;
    	let div1;
    	let div0;
    	let mounted;
    	let dispose;

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
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Back";
    			attr_dev(p0, "class", "scr-p svelte-f7tw5n");
    			add_location(p0, file$q, 6, 2, 151);
    			attr_dev(p1, "class", "scr-p-small svelte-f7tw5n");
    			add_location(p1, file$q, 7, 2, 184);
    			add_location(br, file$q, 8, 2, 253);
    			attr_dev(div0, "class", "scr-btn svelte-f7tw5n");
    			add_location(div0, file$q, 10, 4, 272);
    			add_location(div1, file$q, 9, 2, 262);
    			add_location(center, file$q, 5, 0, 140);
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
    			append_dev(center, div1);
    			append_dev(div1, div0);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", navigateStore.backRoute, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$routerStore*/ 1 && t2_value !== (t2_value = (/*$routerStore*/ ctx[0].currentLocation || "='(") + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			mounted = false;
    			dispose();
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
    	let $routerStore;
    	validate_store(routerStore, "routerStore");
    	component_subscribe($$self, routerStore, $$value => $$invalidate(0, $routerStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_NotFound", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ routerStore, navigateStore, $routerStore });
    	return [$routerStore];
    }

    class SCR_NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_NotFound",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* docsproj/components/SCR_Error.svelte generated by Svelte v3.37.0 */
    const file$p = "docsproj/components/SCR_Error.svelte";

    function create_fragment$q(ctx) {
    	let center;
    	let p0;
    	let t1;
    	let p1;
    	let t2;
    	let t3;
    	let br0;
    	let t4;
    	let br1;
    	let t5;
    	let div1;
    	let div0;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			center = element("center");
    			p0 = element("p");
    			p0.textContent = "Error";
    			t1 = space();
    			p1 = element("p");
    			t2 = text(/*errorMessage*/ ctx[0]);
    			t3 = space();
    			br0 = element("br");
    			t4 = space();
    			br1 = element("br");
    			t5 = space();
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Back";
    			attr_dev(p0, "class", "scr-p svelte-dz0sst");
    			add_location(p0, file$p, 7, 2, 147);
    			attr_dev(p1, "class", "scr-p-small svelte-dz0sst");
    			add_location(p1, file$p, 8, 2, 176);
    			add_location(br0, file$p, 9, 2, 220);
    			add_location(br1, file$p, 10, 2, 229);
    			attr_dev(div0, "class", "scr-btn svelte-dz0sst");
    			add_location(div0, file$p, 12, 4, 248);
    			add_location(div1, file$p, 11, 2, 238);
    			add_location(center, file$p, 6, 0, 136);
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
    			append_dev(center, br0);
    			append_dev(center, t4);
    			append_dev(center, br1);
    			append_dev(center, t5);
    			append_dev(center, div1);
    			append_dev(div1, div0);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", navigateStore.backRoute, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*errorMessage*/ 1) set_data_dev(t2, /*errorMessage*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
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
    	validate_slots("SCR_Error", slots, []);
    	let { errorMessage = "An error has occured!" } = $$props;
    	const writable_props = ["errorMessage"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Error> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("errorMessage" in $$props) $$invalidate(0, errorMessage = $$props.errorMessage);
    	};

    	$$self.$capture_state = () => ({ navigateStore, errorMessage });

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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { errorMessage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Error",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get errorMessage() {
    		throw new Error("<SCR_Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorMessage(value) {
    		throw new Error("<SCR_Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* docsproj/components/SCR_PageFooter.svelte generated by Svelte v3.37.0 */

    const file$o = "docsproj/components/SCR_PageFooter.svelte";

    function create_fragment$p(ctx) {
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
    			add_location(hr, file$o, 1, 2, 27);
    			attr_dev(div, "class", "scr-footer svelte-rxr6jj");
    			add_location(div, file$o, 0, 0, 0);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_PageFooter",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* docsproj/components/common/SCR_PushRouteButton.svelte generated by Svelte v3.37.0 */
    const file$n = "docsproj/components/common/SCR_PushRouteButton.svelte";

    function create_fragment$o(ctx) {
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
    			add_location(button, file$n, 17, 0, 349);
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_PushRouteButton", slots, []);
    	let { routeName = "rootRoute" } = $$props;
    	let { routePath } = $$props;
    	let { text = "Button" } = $$props;
    	let { style = "" } = $$props;
    	let { title } = $$props;

    	function go() {
    		if (!routePath) {
    			pushRoute({ name: routeName });
    			return;
    		}

    		pushRoute({ path: routePath });
    	}

    	const writable_props = ["routeName", "routePath", "text", "style", "title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_PushRouteButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("routeName" in $$props) $$invalidate(4, routeName = $$props.routeName);
    		if ("routePath" in $$props) $$invalidate(5, routePath = $$props.routePath);
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("style" in $$props) $$invalidate(1, style = $$props.style);
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({
    		pushRoute,
    		routeName,
    		routePath,
    		text,
    		style,
    		title,
    		go
    	});

    	$$self.$inject_state = $$props => {
    		if ("routeName" in $$props) $$invalidate(4, routeName = $$props.routeName);
    		if ("routePath" in $$props) $$invalidate(5, routePath = $$props.routePath);
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("style" in $$props) $$invalidate(1, style = $$props.style);
    		if ("title" in $$props) $$invalidate(2, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, style, title, go, routeName, routePath];
    }

    class SCR_PushRouteButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			routeName: 4,
    			routePath: 5,
    			text: 0,
    			style: 1,
    			title: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_PushRouteButton",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*routePath*/ ctx[5] === undefined && !("routePath" in props)) {
    			console.warn("<SCR_PushRouteButton> was created without expected prop 'routePath'");
    		}

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

    	get routePath() {
    		throw new Error("<SCR_PushRouteButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routePath(value) {
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

    /* docsproj/components/pages/SCR_TestLoadingComponentWithBeforeEnter.svelte generated by Svelte v3.37.0 */
    const file$m = "docsproj/components/pages/SCR_TestLoadingComponentWithBeforeEnter.svelte";

    // (106:2) <SCR_ROUTER_LINK     to={{       path: `/svelte-client-router/testLoadingComponentWithBeforeEnter/${         timeoutParam || 10       }?subLoadingText=${queryParam}`,     }}   >
    function create_default_slot_1$9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test Route With Two Params and Route Custom Loading Component";
    			attr_dev(div, "class", "scr-btn svelte-r5my8r");
    			add_location(div, file$m, 112, 4, 3063);
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
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(106:2) <SCR_ROUTER_LINK     to={{       path: `/svelte-client-router/testLoadingComponentWithBeforeEnter/${         timeoutParam || 10       }?subLoadingText=${queryParam}`,     }}   >",
    		ctx
    	});

    	return block;
    }

    // (142:2) <SCR_PageFooter>
    function create_default_slot$j(ctx) {
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
    				routeName: "testRegexPath2Route"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right",
    				text: "Next",
    				routeName: "testAnyWildcardRoute"
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
    			add_location(div0, file$m, 143, 6, 4095);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$m, 142, 4, 4071);
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
    		id: create_default_slot$j.name,
    		type: "slot",
    		source: "(142:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div2;
    	let h4;
    	let t1;
    	let p0;
    	let t3;
    	let ul2;
    	let li0;
    	let t5;
    	let li1;
    	let t7;
    	let li2;
    	let t9;
    	let ul0;
    	let li3;
    	let t11;
    	let li4;
    	let t13;
    	let li5;
    	let t15;
    	let ul1;
    	let li6;
    	let t17;
    	let li7;
    	let t19;
    	let p1;
    	let t20;
    	let br0;
    	let t21;
    	let br1;
    	let t22;
    	let b0;
    	let t24;
    	let p2;
    	let t25;
    	let b1;
    	let t26_value = (/*pathParams*/ ctx[0].timeout || "") + "";
    	let t26;
    	let t27;
    	let br2;
    	let t28;
    	let b2;
    	let t29_value = (/*queryParams*/ ctx[1].subLoadingText || "") + "";
    	let t29;
    	let t30;
    	let br3;
    	let t31;
    	let br4;
    	let t32;
    	let t33;
    	let div0;
    	let label0;
    	let t35;
    	let input0;
    	let t36;
    	let div1;
    	let label1;
    	let t38;
    	let input1;
    	let t39;
    	let scr_router_link;
    	let t40;
    	let hr;
    	let t41;
    	let center;
    	let small;
    	let t43;
    	let pre;
    	let t44;
    	let b3;
    	let t46;
    	let b4;
    	let t48;
    	let t49;
    	let scr_pagefooter;
    	let current;
    	let mounted;
    	let dispose;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: {
    					path: `/svelte-client-router/testLoadingComponentWithBeforeEnter/${/*timeoutParam*/ ctx[2] || 10}?subLoadingText=${/*queryParam*/ ctx[3]}`
    				},
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$j] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Test - Loading Component With Route Before Enter";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "This route is demonstrating several concepts, as some as follows:";
    			t3 = space();
    			ul2 = element("ul");
    			li0 = element("li");
    			li0.textContent = "The Loading Component";
    			t5 = space();
    			li1 = element("li");
    			li1.textContent = "Lazy Loading a Custom Loading Component for this specific Route";
    			t7 = space();
    			li2 = element("li");
    			li2.textContent = "Capturing params in Loading Component";
    			t9 = space();
    			ul0 = element("ul");
    			li3 = element("li");
    			li3.textContent = "Path Params";
    			t11 = space();
    			li4 = element("li");
    			li4.textContent = "Query Params";
    			t13 = space();
    			li5 = element("li");
    			li5.textContent = "Passing query params";
    			t15 = space();
    			ul1 = element("ul");
    			li6 = element("li");
    			li6.textContent = "Try it via browser URL - passing at end of this route\n        ?subLoadingText=MyCustomText!";
    			t17 = space();
    			li7 = element("li");
    			li7.textContent = "Before Enter Route";
    			t19 = space();
    			p1 = element("p");
    			t20 = text("The default value is 2000 milliseconds. If nothing is declared it is assumed\n    2000. Or if it is passed a valid number greater than 10 milliseconds it will\n    wait the milliseconds specified.\n    ");
    			br0 = element("br");
    			t21 = space();
    			br1 = element("br");
    			t22 = space();
    			b0 = element("b");
    			b0.textContent = "Important: All the variables captured by this component are passed to all\n      components!";
    			t24 = space();
    			p2 = element("p");
    			t25 = text("The route timeout param path passed is: ");
    			b1 = element("b");
    			t26 = text(t26_value);
    			t27 = space();
    			br2 = element("br");
    			t28 = text("\n    The route query param passed is: ");
    			b2 = element("b");
    			t29 = text(t29_value);
    			t30 = space();
    			br3 = element("br");
    			t31 = space();
    			br4 = element("br");
    			t32 = text("\n    Try it!");
    			t33 = space();
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Route Timeout Path Param";
    			t35 = space();
    			input0 = element("input");
    			t36 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Route Query Param";
    			t38 = space();
    			input1 = element("input");
    			t39 = space();
    			create_component(scr_router_link.$$.fragment);
    			t40 = space();
    			hr = element("hr");
    			t41 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t43 = space();
    			pre = element("pre");
    			t44 = text("{\n  name: \"testLoadingComponentWithBeforeEnterRoute\",\n  path: \"/svelte-client-router/testLoadingComponentWithBeforeEnter/:timeout\",\n\n  ");
    			b3 = element("b");
    			b3.textContent = "// Lazy loading an specific loading component for this route";
    			t46 = text("\n  lazyLoadLoadingComponent: () =>\n    import(\"./docs/SCR_Loading.svelte\"),\n\n  component: SCR_TestLoadingComponentWithBeforeEnter,\n\n  ");
    			b4 = element("b");
    			b4.textContent = "// Demonstrating one function as before enter";
    			t48 = text("\n  beforeEnter: (resolve, routeFrom, routeTo, routeObjParams, payload) ==> {\n    setTimeout(() => resolve(true), routeObjParams?.pathParams?.timeout || 10)\n  },\n  \n  title: \"SCR - Test - Loading Component with Before Enter\",\n  forceReload: true\n}");
    			t49 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$m, 43, 2, 1045);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$m, 44, 2, 1120);
    			add_location(li0, file$m, 48, 4, 1237);
    			add_location(li1, file$m, 49, 4, 1272);
    			add_location(li2, file$m, 50, 4, 1349);
    			add_location(li3, file$m, 52, 6, 1411);
    			add_location(li4, file$m, 53, 6, 1438);
    			add_location(ul0, file$m, 51, 4, 1400);
    			add_location(li5, file$m, 55, 4, 1474);
    			add_location(li6, file$m, 57, 6, 1519);
    			add_location(ul1, file$m, 56, 4, 1508);
    			add_location(li7, file$m, 62, 4, 1650);
    			add_location(ul2, file$m, 47, 2, 1228);
    			add_location(br0, file$m, 68, 4, 1920);
    			add_location(br1, file$m, 69, 4, 1931);
    			add_location(b0, file$m, 70, 4, 1942);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$m, 64, 2, 1688);
    			add_location(b1, file$m, 76, 44, 2135);
    			add_location(br2, file$m, 77, 4, 2173);
    			add_location(b2, file$m, 78, 37, 2217);
    			add_location(br3, file$m, 79, 4, 2263);
    			add_location(br4, file$m, 80, 4, 2274);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$m, 75, 2, 2062);
    			attr_dev(label0, "for", "scr-timeout-param");
    			attr_dev(label0, "class", "form-label");
    			add_location(label0, file$m, 84, 4, 2325);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-control-sm");
    			attr_dev(input0, "id", "scr-timeout-param");
    			attr_dev(input0, "placeholder", ":timeoutParam");
    			add_location(input0, file$m, 87, 4, 2424);
    			attr_dev(div0, "class", "mb-3");
    			add_location(div0, file$m, 83, 2, 2302);
    			attr_dev(label1, "for", "scr-query-param");
    			attr_dev(label1, "class", "form-label");
    			add_location(label1, file$m, 96, 4, 2628);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control form-control-sm");
    			attr_dev(input1, "id", "scr-query-param");
    			attr_dev(input1, "placeholder", ":queryParam");
    			add_location(input1, file$m, 97, 4, 2706);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file$m, 95, 2, 2605);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$m, 116, 2, 3187);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$m, 118, 4, 3243);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$m, 117, 2, 3211);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$m, 126, 2, 3490);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$m, 132, 2, 3708);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file$m, 120, 2, 3324);
    			attr_dev(div2, "class", "scr-page");
    			add_location(div2, file$m, 42, 0, 1020);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h4);
    			append_dev(div2, t1);
    			append_dev(div2, p0);
    			append_dev(div2, t3);
    			append_dev(div2, ul2);
    			append_dev(ul2, li0);
    			append_dev(ul2, t5);
    			append_dev(ul2, li1);
    			append_dev(ul2, t7);
    			append_dev(ul2, li2);
    			append_dev(ul2, t9);
    			append_dev(ul2, ul0);
    			append_dev(ul0, li3);
    			append_dev(ul0, t11);
    			append_dev(ul0, li4);
    			append_dev(ul2, t13);
    			append_dev(ul2, li5);
    			append_dev(ul2, t15);
    			append_dev(ul2, ul1);
    			append_dev(ul1, li6);
    			append_dev(ul2, t17);
    			append_dev(ul2, li7);
    			append_dev(div2, t19);
    			append_dev(div2, p1);
    			append_dev(p1, t20);
    			append_dev(p1, br0);
    			append_dev(p1, t21);
    			append_dev(p1, br1);
    			append_dev(p1, t22);
    			append_dev(p1, b0);
    			append_dev(div2, t24);
    			append_dev(div2, p2);
    			append_dev(p2, t25);
    			append_dev(p2, b1);
    			append_dev(b1, t26);
    			append_dev(p2, t27);
    			append_dev(p2, br2);
    			append_dev(p2, t28);
    			append_dev(p2, b2);
    			append_dev(b2, t29);
    			append_dev(p2, t30);
    			append_dev(p2, br3);
    			append_dev(p2, t31);
    			append_dev(p2, br4);
    			append_dev(p2, t32);
    			append_dev(div2, t33);
    			append_dev(div2, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t35);
    			append_dev(div0, input0);
    			set_input_value(input0, /*timeoutParam*/ ctx[2]);
    			append_dev(div2, t36);
    			append_dev(div2, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t38);
    			append_dev(div1, input1);
    			set_input_value(input1, /*queryParam*/ ctx[3]);
    			append_dev(div2, t39);
    			mount_component(scr_router_link, div2, null);
    			append_dev(div2, t40);
    			append_dev(div2, hr);
    			append_dev(div2, t41);
    			append_dev(div2, center);
    			append_dev(center, small);
    			append_dev(div2, t43);
    			append_dev(div2, pre);
    			append_dev(pre, t44);
    			append_dev(pre, b3);
    			append_dev(pre, t46);
    			append_dev(pre, b4);
    			append_dev(pre, t48);
    			append_dev(div2, t49);
    			mount_component(scr_pagefooter, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*pathParams*/ 1) && t26_value !== (t26_value = (/*pathParams*/ ctx[0].timeout || "") + "")) set_data_dev(t26, t26_value);
    			if ((!current || dirty & /*queryParams*/ 2) && t29_value !== (t29_value = (/*queryParams*/ ctx[1].subLoadingText || "") + "")) set_data_dev(t29, t29_value);

    			if (dirty & /*timeoutParam*/ 4 && input0.value !== /*timeoutParam*/ ctx[2]) {
    				set_input_value(input0, /*timeoutParam*/ ctx[2]);
    			}

    			if (dirty & /*queryParam*/ 8 && input1.value !== /*queryParam*/ ctx[3]) {
    				set_input_value(input1, /*queryParam*/ ctx[3]);
    			}

    			const scr_router_link_changes = {};

    			if (dirty & /*timeoutParam, queryParam*/ 12) scr_router_link_changes.to = {
    				path: `/svelte-client-router/testLoadingComponentWithBeforeEnter/${/*timeoutParam*/ ctx[2] || 10}?subLoadingText=${/*queryParam*/ ctx[3]}`
    			};

    			if (dirty & /*$$scope*/ 1024) {
    				scr_router_link_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link.$set(scr_router_link_changes);
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
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
    			if (detaching) detach_dev(div2);
    			destroy_component(scr_router_link);
    			destroy_component(scr_pagefooter);
    			mounted = false;
    			run_all(dispose);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_TestLoadingComponentWithBeforeEnter", slots, []);
    	let { pathParams = {} } = $$props;
    	let { queryParams = {} } = $$props;
    	let regex = /[0-9]/g;
    	let queryRegex = /[A-Za-zÀ-ú0-9]/g;
    	let timeoutParam = 2000;
    	let queryParam = "";

    	function applyRegex(param = "") {
    		if (!param) {
    			return param;
    		}

    		param = param.toString();
    		const match = param.match(regex);
    		const value = match ? match.join("").substr(0, 100) + "" : "";
    		return value;
    	}

    	function applyQueryRegex(param = "") {
    		if (!param) {
    			return param;
    		}

    		param = param.toString();
    		const match = param.match(queryRegex);
    		const value = match ? match.join("").substr(0, 100) + "" : "";
    		return value;
    	}

    	const writable_props = ["pathParams", "queryParams"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_TestLoadingComponentWithBeforeEnter> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		timeoutParam = this.value;
    		$$invalidate(2, timeoutParam);
    	}

    	function input1_input_handler() {
    		queryParam = this.value;
    		$$invalidate(3, queryParam);
    	}

    	$$self.$$set = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    		if ("queryParams" in $$props) $$invalidate(1, queryParams = $$props.queryParams);
    	};

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton,
    		pathParams,
    		queryParams,
    		regex,
    		queryRegex,
    		timeoutParam,
    		queryParam,
    		applyRegex,
    		applyQueryRegex
    	});

    	$$self.$inject_state = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    		if ("queryParams" in $$props) $$invalidate(1, queryParams = $$props.queryParams);
    		if ("regex" in $$props) regex = $$props.regex;
    		if ("queryRegex" in $$props) queryRegex = $$props.queryRegex;
    		if ("timeoutParam" in $$props) $$invalidate(2, timeoutParam = $$props.timeoutParam);
    		if ("queryParam" in $$props) $$invalidate(3, queryParam = $$props.queryParam);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*timeoutParam*/ 4) {
    			if (timeoutParam) {
    				$$invalidate(2, timeoutParam = applyRegex(timeoutParam));
    			}
    		}

    		if ($$self.$$.dirty & /*queryParam*/ 8) {
    			if (queryParam) {
    				$$invalidate(3, queryParam = applyQueryRegex(queryParam));
    			}
    		}
    	};

    	return [
    		pathParams,
    		queryParams,
    		timeoutParam,
    		queryParam,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class SCR_TestLoadingComponentWithBeforeEnter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { pathParams: 0, queryParams: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_TestLoadingComponentWithBeforeEnter",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get pathParams() {
    		throw new Error("<SCR_TestLoadingComponentWithBeforeEnter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pathParams(value) {
    		throw new Error("<SCR_TestLoadingComponentWithBeforeEnter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get queryParams() {
    		throw new Error("<SCR_TestLoadingComponentWithBeforeEnter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set queryParams(value) {
    		throw new Error("<SCR_TestLoadingComponentWithBeforeEnter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* docsproj/App.svelte generated by Svelte v3.37.0 */

    const { console: console_1$1 } = globals;

    function create_fragment$m(ctx) {
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
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
    			name: "testRegexPathRoute",
    			path: "/svelte-client-router/:teste/testRegexPathParam",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_TestRegexPath$1; }),
    			title: "SCR - Test - Regex Path Route",
    			forceReload: true
    		},
    		{
    			name: "testRegexPath2Route",
    			path: "/svelte-client-router/:firstParam/testRegexPathParam2/:secondParam",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_TestRegexPath2$1; }),
    			title: "SCR - Test - - Regex Path Route 2",
    			forceReload: true
    		},
    		{
    			name: "testLoadingComponentWithBeforeEnterRoute",
    			path: "/svelte-client-router/testLoadingComponentWithBeforeEnter/:timeout",
    			lazyLoadLoadingComponent: () => Promise.resolve().then(function () { return SCR_Loading$1; }),
    			component: SCR_TestLoadingComponentWithBeforeEnter,
    			beforeEnter: (resolve, routeFrom, routeTo, routeObjParams, payload) => {
    				setTimeout(() => resolve(true), routeObjParams?.pathParams?.timeout || 10);
    			},
    			title: "SCR - Test - Loading Component with Before Enter",
    			forceReload: true
    		},
    		{
    			name: "testAnyWildcardRoute",
    			path: "/svelte-client-router/anyRouteWildcard/*/:somePathParam",
    			lazyLoadComponent: () => Promise.resolve().then(function () { return SCR_TestAnyRouteWildcard$1; }),
    			title: "SCR - Test - Any Route Wildcard",
    			forceReload: true
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<App> was created with unknown prop '${key}'`);
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
    		SCR_TestLoadingComponentWithBeforeEnter,
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    /* docsproj/components/pages/SCR_Presentation.svelte generated by Svelte v3.37.0 */

    const { console: console_1 } = globals;
    const file$l = "docsproj/components/pages/SCR_Presentation.svelte";

    // (76:2) <SCR_PageFooter>
    function create_default_slot$i(ctx) {
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
    			add_location(div0, file$l, 77, 6, 2726);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$l, 76, 4, 2702);
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
    		id: create_default_slot$i.name,
    		type: "slot",
    		source: "(76:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
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
    				$$slots: { default: [create_default_slot$i] },
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
    			add_location(h4, file$l, 11, 2, 302);
    			add_location(br0, file$l, 15, 4, 492);
    			add_location(br1, file$l, 16, 4, 503);
    			add_location(br2, file$l, 20, 4, 697);
    			add_location(br3, file$l, 21, 4, 708);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$l, 12, 2, 341);
    			attr_dev(li0, "class", "scr-li svelte-1kf261k");
    			add_location(li0, file$l, 25, 4, 766);
    			attr_dev(li1, "class", "scr-li svelte-1kf261k");
    			add_location(li1, file$l, 26, 4, 827);
    			add_location(u0, file$l, 28, 40, 943);
    			add_location(b0, file$l, 28, 37, 940);
    			attr_dev(li2, "class", "scr-li svelte-1kf261k");
    			add_location(li2, file$l, 27, 4, 883);
    			add_location(u1, file$l, 31, 40, 1038);
    			add_location(b1, file$l, 31, 37, 1035);
    			attr_dev(li3, "class", "scr-li svelte-1kf261k");
    			add_location(li3, file$l, 30, 4, 978);
    			attr_dev(li4, "class", "scr-li svelte-1kf261k");
    			add_location(li4, file$l, 33, 4, 1074);
    			attr_dev(li5, "class", "scr-li svelte-1kf261k");
    			add_location(li5, file$l, 36, 4, 1178);
    			attr_dev(li6, "class", "scr-li svelte-1kf261k");
    			add_location(li6, file$l, 37, 4, 1252);
    			attr_dev(li7, "class", "scr-li svelte-1kf261k");
    			add_location(li7, file$l, 38, 4, 1332);
    			attr_dev(li8, "class", "scr-li svelte-1kf261k");
    			add_location(li8, file$l, 42, 4, 1456);
    			attr_dev(li9, "class", "scr-li svelte-1kf261k");
    			add_location(li9, file$l, 43, 4, 1533);
    			attr_dev(li10, "class", "scr-li svelte-1kf261k");
    			add_location(li10, file$l, 44, 4, 1592);
    			attr_dev(li11, "class", "scr-li svelte-1kf261k");
    			add_location(li11, file$l, 48, 4, 1724);
    			add_location(ul, file$l, 24, 2, 757);
    			add_location(br4, file$l, 55, 4, 2077);
    			add_location(br5, file$l, 56, 4, 2088);
    			add_location(br6, file$l, 60, 4, 2293);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$l, 50, 2, 1794);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$l, 64, 4, 2370);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$l, 63, 2, 2338);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file$l, 66, 2, 2451);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$l, 10, 0, 277);
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

    			if (dirty & /*$$scope*/ 4) {
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_Presentation", slots, []);
    	let { pathParams } = $$props;
    	let { queryParams } = $$props;
    	const writable_props = ["pathParams", "queryParams"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<SCR_Presentation> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    		if ("queryParams" in $$props) $$invalidate(1, queryParams = $$props.queryParams);
    	};

    	$$self.$capture_state = () => ({
    		SCR_PageFooter,
    		SCR_PushRouteButton,
    		pathParams,
    		queryParams
    	});

    	$$self.$inject_state = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    		if ("queryParams" in $$props) $$invalidate(1, queryParams = $$props.queryParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*pathParams*/ 1) {
    			console.log("PATH", pathParams);
    		}

    		if ($$self.$$.dirty & /*queryParams*/ 2) {
    			console.log("QUERY", queryParams);
    		}
    	};

    	return [pathParams, queryParams];
    }

    class SCR_Presentation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { pathParams: 0, queryParams: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Presentation",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pathParams*/ ctx[0] === undefined && !("pathParams" in props)) {
    			console_1.warn("<SCR_Presentation> was created without expected prop 'pathParams'");
    		}

    		if (/*queryParams*/ ctx[1] === undefined && !("queryParams" in props)) {
    			console_1.warn("<SCR_Presentation> was created without expected prop 'queryParams'");
    		}
    	}

    	get pathParams() {
    		throw new Error("<SCR_Presentation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pathParams(value) {
    		throw new Error("<SCR_Presentation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get queryParams() {
    		throw new Error("<SCR_Presentation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set queryParams(value) {
    		throw new Error("<SCR_Presentation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SCR_Presentation$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_Presentation
    });

    /* docsproj/components/pages/SCR_Installation.svelte generated by Svelte v3.37.0 */
    const file$k = "docsproj/components/pages/SCR_Installation.svelte";

    // (45:2) <SCR_PageFooter>
    function create_default_slot$h(ctx) {
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
    			add_location(div0, file$k, 46, 6, 1242);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$k, 45, 4, 1218);
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
    		id: create_default_slot$h.name,
    		type: "slot",
    		source: "(45:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
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
    				$$slots: { default: [create_default_slot$h] },
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
    			add_location(h4, file$k, 6, 2, 176);
    			add_location(h50, file$k, 7, 2, 215);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$k, 8, 2, 235);
    			add_location(h51, file$k, 11, 2, 305);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$k, 14, 4, 370);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$k, 12, 2, 340);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$k, 28, 4, 714);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$k, 27, 2, 682);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$k, 32, 4, 825);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$k, 30, 2, 795);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$k, 5, 0, 151);
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Installation",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    var SCR_Installation$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_Installation
    });

    /* docsproj/components/pages/SCR_GettingStarted.svelte generated by Svelte v3.37.0 */
    const file$j = "docsproj/components/pages/SCR_GettingStarted.svelte";

    // (147:2) <SCR_PageFooter>
    function create_default_slot$g(ctx) {
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
    			add_location(div0, file$j, 148, 6, 4592);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$j, 147, 4, 4568);
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
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(147:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
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
    				$$slots: { default: [create_default_slot$g] },
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
    			add_location(h4, file$j, 6, 2, 176);
    			add_location(h50, file$j, 7, 2, 218);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$j, 20, 0, 489);
    			attr_dev(a0, "href", "https://svelte.dev/tutorial/slots");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$j, 21, 20, 620);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$j, 21, 0, 600);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$j, 8, 2, 262);
    			add_location(br0, file$j, 24, 2, 787);
    			add_location(h51, file$j, 25, 2, 796);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$j, 26, 2, 824);
    			add_location(br1, file$j, 59, 2, 1792);
    			add_location(h52, file$j, 60, 2, 1801);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$j, 61, 2, 1832);
    			add_location(br2, file$j, 67, 4, 2049);
    			add_location(br3, file$j, 68, 4, 2060);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$j, 65, 2, 1961);
    			add_location(br4, file$j, 72, 2, 2205);
    			add_location(h53, file$j, 73, 2, 2214);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$j, 76, 0, 2264);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$j, 79, 0, 2321);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$j, 90, 0, 2573);
    			attr_dev(a1, "href", "https://svelte.dev/tutorial/slots");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$j, 91, 20, 2704);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$j, 91, 0, 2684);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$j, 92, 0, 2805);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$j, 95, 0, 2915);
    			attr_dev(b8, "class", "scr-b");
    			add_location(b8, file$j, 98, 6, 2988);
    			attr_dev(b9, "class", "scr-b");
    			add_location(b9, file$j, 130, 0, 3983);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$j, 74, 2, 2238);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$j, 134, 4, 4215);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$j, 133, 2, 4183);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$j, 136, 2, 4296);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$j, 5, 0, 151);
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
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_GettingStarted",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    var SCR_GettingStarted$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_GettingStarted
    });

    /* docsproj/components/pages/SCR_ConfigurationOptions.svelte generated by Svelte v3.37.0 */
    const file$i = "docsproj/components/pages/SCR_ConfigurationOptions.svelte";

    // (375:2) <SCR_PageFooter>
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
    			add_location(div0, file$i, 376, 6, 12549);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$i, 375, 4, 12525);
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
    		source: "(375:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
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
    				$$slots: { default: [create_default_slot$f] },
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
    			t92 = text("\n{\n  error: \"/error\", \n}\n\n");
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
    			add_location(h40, file$i, 6, 2, 176);
    			attr_dev(a, "href", "https://svelte.dev/tutorial/writable-stores");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$i, 8, 39, 267);
    			add_location(p0, file$i, 7, 2, 224);
    			add_location(h5, file$i, 16, 2, 589);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$i, 19, 0, 636);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$i, 17, 2, 610);
    			add_location(p1, file$i, 22, 2, 767);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$i, 24, 2, 918);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$i, 25, 2, 942);
    			add_location(b1, file$i, 27, 8, 1015);
    			add_location(b2, file$i, 28, 39, 1127);
    			add_location(br0, file$i, 30, 4, 1220);
    			add_location(br1, file$i, 31, 4, 1231);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$i, 26, 2, 978);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$i, 37, 0, 1418);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$i, 48, 0, 1701);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$i, 35, 2, 1392);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$i, 53, 2, 1978);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$i, 54, 2, 2002);
    			add_location(b5, file$i, 56, 8, 2090);
    			add_location(br2, file$i, 60, 4, 2360);
    			add_location(br3, file$i, 61, 4, 2371);
    			attr_dev(p3, "class", "scr-text-justify");
    			add_location(p3, file$i, 55, 2, 2053);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$i, 66, 0, 2470);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$i, 77, 0, 2728);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$i, 64, 2, 2444);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$i, 82, 2, 3017);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$i, 83, 2, 3041);
    			add_location(b8, file$i, 85, 8, 3114);
    			attr_dev(p4, "class", "scr-text-justify");
    			add_location(p4, file$i, 84, 2, 3077);
    			add_location(b9, file$i, 89, 6, 3193);
    			add_location(li0, file$i, 88, 4, 3182);
    			add_location(b10, file$i, 91, 8, 3286);
    			add_location(li1, file$i, 91, 4, 3282);
    			add_location(b11, file$i, 92, 8, 3365);
    			add_location(li2, file$i, 92, 4, 3361);
    			add_location(ul0, file$i, 87, 2, 3173);
    			add_location(p5, file$i, 94, 2, 3426);
    			attr_dev(b12, "class", "scr-b");
    			add_location(b12, file$i, 101, 0, 3630);
    			attr_dev(b13, "class", "scr-b");
    			add_location(b13, file$i, 114, 0, 4054);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$i, 99, 2, 3604);
    			attr_dev(hr3, "class", "scr-hr");
    			add_location(hr3, file$i, 119, 2, 4341);
    			attr_dev(h44, "class", "scr-h4");
    			add_location(h44, file$i, 120, 2, 4365);
    			add_location(b14, file$i, 122, 8, 4444);
    			add_location(br4, file$i, 124, 4, 4555);
    			add_location(br5, file$i, 125, 4, 4566);
    			add_location(b15, file$i, 126, 4, 4577);
    			attr_dev(p6, "class", "scr-text-justify");
    			add_location(p6, file$i, 121, 2, 4407);
    			attr_dev(b16, "class", "scr-b");
    			add_location(b16, file$i, 130, 0, 4650);
    			attr_dev(b17, "class", "scr-b");
    			add_location(b17, file$i, 140, 0, 4884);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$i, 128, 2, 4624);
    			attr_dev(hr4, "class", "scr-hr");
    			add_location(hr4, file$i, 145, 2, 5173);
    			attr_dev(h45, "class", "scr-h4");
    			add_location(h45, file$i, 146, 2, 5197);
    			add_location(b18, file$i, 148, 8, 5272);
    			add_location(br6, file$i, 150, 4, 5357);
    			add_location(br7, file$i, 151, 4, 5368);
    			add_location(b19, file$i, 152, 4, 5379);
    			attr_dev(p7, "class", "scr-text-justify");
    			add_location(p7, file$i, 147, 2, 5235);
    			attr_dev(b20, "class", "scr-b");
    			add_location(b20, file$i, 156, 0, 5452);
    			attr_dev(b21, "class", "scr-b");
    			add_location(b21, file$i, 166, 0, 5672);
    			attr_dev(pre5, "class", "scr-pre");
    			add_location(pre5, file$i, 154, 2, 5426);
    			attr_dev(hr5, "class", "scr-hr");
    			add_location(hr5, file$i, 171, 2, 5955);
    			attr_dev(h46, "class", "scr-h4");
    			add_location(h46, file$i, 172, 2, 5979);
    			add_location(b22, file$i, 174, 8, 6069);
    			add_location(br8, file$i, 176, 4, 6174);
    			add_location(br9, file$i, 177, 4, 6185);
    			attr_dev(p8, "class", "scr-text-justify");
    			add_location(p8, file$i, 173, 2, 6032);
    			attr_dev(b23, "class", "scr-b");
    			add_location(b23, file$i, 182, 0, 6313);
    			attr_dev(b24, "class", "scr-b");
    			add_location(b24, file$i, 192, 0, 6531);
    			attr_dev(pre6, "class", "scr-pre");
    			add_location(pre6, file$i, 180, 2, 6287);
    			attr_dev(hr6, "class", "scr-hr");
    			add_location(hr6, file$i, 197, 2, 6821);
    			attr_dev(h47, "class", "scr-h4");
    			add_location(h47, file$i, 198, 2, 6845);
    			add_location(b25, file$i, 200, 8, 6927);
    			add_location(br10, file$i, 202, 4, 7012);
    			add_location(br11, file$i, 203, 4, 7023);
    			attr_dev(p9, "class", "scr-text-justify");
    			add_location(p9, file$i, 199, 2, 6890);
    			attr_dev(b26, "class", "scr-b");
    			add_location(b26, file$i, 208, 0, 7107);
    			attr_dev(b27, "class", "scr-b");
    			add_location(b27, file$i, 218, 0, 7322);
    			attr_dev(pre7, "class", "scr-pre");
    			add_location(pre7, file$i, 206, 2, 7081);
    			attr_dev(hr7, "class", "scr-hr");
    			add_location(hr7, file$i, 223, 2, 7607);
    			attr_dev(h48, "class", "scr-h4");
    			add_location(h48, file$i, 224, 2, 7631);
    			add_location(b28, file$i, 226, 8, 7712);
    			add_location(br12, file$i, 228, 4, 7807);
    			add_location(br13, file$i, 229, 4, 7818);
    			add_location(br14, file$i, 232, 4, 7970);
    			add_location(br15, file$i, 233, 4, 7981);
    			attr_dev(p10, "class", "scr-text-justify");
    			add_location(p10, file$i, 225, 2, 7675);
    			attr_dev(b29, "class", "scr-b");
    			add_location(b29, file$i, 239, 0, 8190);
    			attr_dev(b30, "class", "scr-b");
    			add_location(b30, file$i, 249, 0, 8414);
    			attr_dev(pre8, "class", "scr-pre");
    			add_location(pre8, file$i, 237, 2, 8164);
    			attr_dev(hr8, "class", "scr-hr");
    			add_location(hr8, file$i, 254, 2, 8698);
    			attr_dev(h49, "class", "scr-h4");
    			add_location(h49, file$i, 255, 2, 8722);
    			add_location(b31, file$i, 257, 8, 8827);
    			attr_dev(p11, "class", "scr-text-justify");
    			add_location(p11, file$i, 256, 2, 8790);
    			attr_dev(b32, "class", "scr-b");
    			add_location(b32, file$i, 262, 0, 9018);
    			attr_dev(b33, "class", "scr-b");
    			add_location(b33, file$i, 272, 0, 9272);
    			attr_dev(pre9, "class", "scr-pre");
    			add_location(pre9, file$i, 260, 2, 8992);
    			attr_dev(hr9, "class", "scr-hr");
    			add_location(hr9, file$i, 277, 2, 9577);
    			attr_dev(h410, "class", "scr-h4");
    			add_location(h410, file$i, 278, 2, 9601);
    			add_location(b34, file$i, 280, 8, 9675);
    			add_location(b35, file$i, 281, 61, 9801);
    			add_location(b36, file$i, 283, 4, 9906);
    			add_location(b37, file$i, 284, 25, 9950);
    			attr_dev(p12, "class", "scr-text-justify");
    			add_location(p12, file$i, 279, 2, 9638);
    			attr_dev(b38, "class", "scr-b");
    			add_location(b38, file$i, 288, 0, 10015);
    			attr_dev(b39, "class", "scr-b");
    			add_location(b39, file$i, 297, 0, 10181);
    			attr_dev(pre10, "class", "scr-pre");
    			add_location(pre10, file$i, 286, 2, 9989);
    			attr_dev(hr10, "class", "scr-hr");
    			add_location(hr10, file$i, 302, 2, 10459);
    			attr_dev(h411, "class", "scr-h4");
    			add_location(h411, file$i, 303, 2, 10483);
    			add_location(b40, file$i, 305, 8, 10559);
    			attr_dev(p13, "class", "scr-text-justify");
    			add_location(p13, file$i, 304, 2, 10522);
    			add_location(b41, file$i, 309, 8, 10697);
    			add_location(li3, file$i, 309, 4, 10693);
    			add_location(b42, file$i, 310, 8, 10764);
    			add_location(li4, file$i, 310, 4, 10760);
    			add_location(b43, file$i, 312, 6, 10840);
    			add_location(li5, file$i, 311, 4, 10829);
    			add_location(b44, file$i, 316, 6, 10952);
    			add_location(li6, file$i, 315, 4, 10941);
    			add_location(ul1, file$i, 308, 2, 10684);
    			attr_dev(b45, "class", "scr-b");
    			add_location(b45, file$i, 322, 0, 11146);
    			attr_dev(b46, "class", "scr-b");
    			add_location(b46, file$i, 348, 0, 11743);
    			attr_dev(pre11, "class", "scr-pre");
    			add_location(pre11, file$i, 320, 2, 11120);
    			attr_dev(p14, "class", "scr-text-justify");
    			add_location(p14, file$i, 356, 2, 11906);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$i, 363, 4, 12149);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$i, 362, 2, 12117);
    			attr_dev(pre12, "class", "scr-pre");
    			add_location(pre12, file$i, 365, 2, 12230);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$i, 5, 0, 151);
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_ConfigurationOptions",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    var SCR_ConfigurationOptions$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_ConfigurationOptions
    });

    /* docsproj/components/common/SCR_BeforeEnterRouteAnatomy.svelte generated by Svelte v3.37.0 */

    const file$h = "docsproj/components/common/SCR_BeforeEnterRouteAnatomy.svelte";

    function create_fragment$h(ctx) {
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
    			add_location(h4, file$h, 0, 0, 0);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$h, 1, 0, 61);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$h, 7, 0, 266);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file$h, 5, 0, 242);
    			add_location(b1, file$h, 14, 4, 458);
    			add_location(br0, file$h, 17, 4, 657);
    			add_location(b2, file$h, 22, 8, 810);
    			add_location(li0, file$h, 21, 6, 797);
    			add_location(b3, file$h, 26, 8, 943);
    			add_location(li1, file$h, 25, 6, 930);
    			add_location(b4, file$h, 30, 8, 1091);
    			add_location(br1, file$h, 33, 8, 1308);
    			add_location(br2, file$h, 35, 8, 1388);
    			add_location(br3, file$h, 36, 8, 1403);
    			add_location(li2, file$h, 29, 6, 1078);
    			add_location(b5, file$h, 39, 8, 1441);
    			add_location(br4, file$h, 42, 8, 1654);
    			add_location(br5, file$h, 44, 8, 1730);
    			add_location(br6, file$h, 45, 8, 1745);
    			add_location(li3, file$h, 38, 6, 1428);
    			add_location(b6, file$h, 48, 8, 1783);
    			add_location(br7, file$h, 51, 8, 2010);
    			add_location(br8, file$h, 53, 8, 2090);
    			add_location(br9, file$h, 54, 8, 2105);
    			add_location(li4, file$h, 47, 6, 1770);
    			add_location(ul0, file$h, 20, 4, 786);
    			add_location(li5, file$h, 13, 2, 449);
    			add_location(b7, file$h, 59, 4, 2153);
    			add_location(b8, file$h, 62, 10, 2307);
    			add_location(li6, file$h, 62, 6, 2303);
    			add_location(b9, file$h, 63, 10, 2357);
    			add_location(li7, file$h, 63, 6, 2353);
    			add_location(b10, file$h, 65, 8, 2422);
    			add_location(li8, file$h, 64, 6, 2409);
    			add_location(b11, file$h, 68, 8, 2522);
    			add_location(li9, file$h, 67, 6, 2509);
    			add_location(b12, file$h, 72, 8, 2638);
    			add_location(li10, file$h, 71, 6, 2625);
    			add_location(b13, file$h, 76, 8, 2777);
    			add_location(li11, file$h, 75, 6, 2764);
    			add_location(b14, file$h, 79, 10, 2909);
    			add_location(li12, file$h, 79, 6, 2905);
    			add_location(b15, file$h, 80, 10, 2979);
    			add_location(li13, file$h, 80, 6, 2975);
    			add_location(ul1, file$h, 61, 4, 2292);
    			add_location(li14, file$h, 58, 2, 2144);
    			add_location(br10, file$h, 83, 2, 3061);
    			add_location(b16, file$h, 85, 4, 3079);
    			add_location(b17, file$h, 88, 10, 3228);
    			add_location(li15, file$h, 88, 6, 3224);
    			add_location(b18, file$h, 89, 10, 3278);
    			add_location(li16, file$h, 89, 6, 3274);
    			add_location(b19, file$h, 91, 8, 3343);
    			add_location(li17, file$h, 90, 6, 3330);
    			add_location(b20, file$h, 94, 8, 3443);
    			add_location(li18, file$h, 93, 6, 3430);
    			add_location(b21, file$h, 98, 8, 3559);
    			add_location(li19, file$h, 97, 6, 3546);
    			add_location(b22, file$h, 102, 8, 3698);
    			add_location(li20, file$h, 101, 6, 3685);
    			add_location(b23, file$h, 105, 10, 3830);
    			add_location(li21, file$h, 105, 6, 3826);
    			add_location(b24, file$h, 106, 10, 3900);
    			add_location(li22, file$h, 106, 6, 3896);
    			add_location(ul2, file$h, 87, 4, 3213);
    			add_location(li23, file$h, 84, 2, 3070);
    			add_location(br11, file$h, 109, 2, 3982);
    			add_location(b25, file$h, 111, 4, 4000);
    			add_location(li24, file$h, 110, 2, 3991);
    			add_location(br12, file$h, 115, 2, 4238);
    			add_location(b26, file$h, 117, 4, 4256);
    			add_location(br13, file$h, 120, 4, 4482);
    			add_location(b27, file$h, 122, 6, 4524);
    			set_style(span, "color", "red");
    			add_location(span, file$h, 121, 4, 4493);
    			add_location(li25, file$h, 116, 2, 4247);
    			add_location(ul3, file$h, 12, 0, 442);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$h, 128, 0, 4746);
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_BeforeEnterRouteAnatomy",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* docsproj/components/pages/SCR_ConfigurationBeforeEnter.svelte generated by Svelte v3.37.0 */
    const file$g = "docsproj/components/pages/SCR_ConfigurationBeforeEnter.svelte";

    // (29:12) <SCR_ROUTER_LINK       to={{ name: "routeObjectOptionsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$8(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Route Object Properties";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$g, 32, 6, 1467);
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
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(29:12) <SCR_ROUTER_LINK       to={{ name: \\\"routeObjectOptionsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (73:2) <SCR_PageFooter>
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
    			add_location(div0, file$g, 74, 6, 2957);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$g, 73, 4, 2933);
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
    		source: "(73:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
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
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_beforeenterrouteanatomy = new SCR_BeforeEnterRouteAnatomy({ $$inline: true });

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
    			add_location(h4, file$g, 8, 2, 325);
    			add_location(b0, file$g, 10, 8, 426);
    			add_location(b1, file$g, 12, 4, 564);
    			add_location(br0, file$g, 14, 4, 648);
    			add_location(br1, file$g, 15, 4, 659);
    			add_location(br2, file$g, 20, 4, 962);
    			add_location(br3, file$g, 21, 4, 973);
    			add_location(b2, file$g, 23, 4, 1056);
    			add_location(br4, file$g, 26, 4, 1293);
    			add_location(br5, file$g, 27, 4, 1304);
    			add_location(br6, file$g, 34, 4, 1579);
    			add_location(br7, file$g, 35, 4, 1590);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$g, 9, 2, 389);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$g, 40, 0, 1684);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$g, 43, 0, 1819);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$g, 44, 0, 1877);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$g, 47, 0, 2018);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$g, 49, 0, 2047);
    			attr_dev(b8, "class", "scr-b");
    			add_location(b8, file$g, 50, 0, 2116);
    			attr_dev(b9, "class", "scr-b");
    			add_location(b9, file$g, 51, 0, 2178);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$g, 38, 2, 1658);
    			add_location(br8, file$g, 58, 2, 2451);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$g, 61, 4, 2526);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$g, 60, 2, 2494);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$g, 63, 2, 2607);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$g, 7, 0, 300);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_ConfigurationBeforeEnter",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    var SCR_ConfigurationBeforeEnter$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_ConfigurationBeforeEnter
    });

    /* docsproj/components/common/SCR_OnErrorAnatomy.svelte generated by Svelte v3.37.0 */

    const file$f = "docsproj/components/common/SCR_OnErrorAnatomy.svelte";

    function create_fragment$f(ctx) {
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
    			add_location(h4, file$f, 0, 0, 0);
    			add_location(br0, file$f, 4, 2, 195);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$f, 1, 0, 57);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$f, 9, 0, 274);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file$f, 7, 0, 250);
    			add_location(b1, file$f, 16, 4, 429);
    			add_location(li0, file$f, 15, 2, 420);
    			add_location(b2, file$f, 19, 4, 511);
    			add_location(br1, file$f, 21, 4, 599);
    			add_location(b3, file$f, 25, 8, 701);
    			add_location(b4, file$f, 29, 14, 906);
    			add_location(li1, file$f, 29, 10, 902);
    			add_location(b5, file$f, 30, 14, 960);
    			add_location(li2, file$f, 30, 10, 956);
    			add_location(b6, file$f, 32, 12, 1033);
    			add_location(li3, file$f, 31, 10, 1016);
    			add_location(b7, file$f, 35, 12, 1145);
    			add_location(li4, file$f, 34, 10, 1128);
    			add_location(b8, file$f, 39, 12, 1277);
    			add_location(li5, file$f, 38, 10, 1260);
    			add_location(b9, file$f, 43, 12, 1432);
    			add_location(li6, file$f, 42, 10, 1415);
    			add_location(b10, file$f, 46, 14, 1576);
    			add_location(li7, file$f, 46, 10, 1572);
    			add_location(b11, file$f, 47, 14, 1650);
    			add_location(li8, file$f, 47, 10, 1646);
    			add_location(ul0, file$f, 28, 8, 887);
    			add_location(li9, file$f, 24, 6, 688);
    			add_location(br2, file$f, 50, 6, 1744);
    			add_location(b12, file$f, 52, 8, 1770);
    			add_location(b13, file$f, 56, 14, 1971);
    			add_location(li10, file$f, 56, 10, 1967);
    			add_location(b14, file$f, 57, 14, 2025);
    			add_location(li11, file$f, 57, 10, 2021);
    			add_location(b15, file$f, 59, 12, 2098);
    			add_location(li12, file$f, 58, 10, 2081);
    			add_location(b16, file$f, 62, 12, 2210);
    			add_location(li13, file$f, 61, 10, 2193);
    			add_location(b17, file$f, 66, 12, 2342);
    			add_location(li14, file$f, 65, 10, 2325);
    			add_location(b18, file$f, 70, 12, 2497);
    			add_location(li15, file$f, 69, 10, 2480);
    			add_location(b19, file$f, 73, 14, 2641);
    			add_location(li16, file$f, 73, 10, 2637);
    			add_location(b20, file$f, 74, 14, 2715);
    			add_location(li17, file$f, 74, 10, 2711);
    			add_location(ul1, file$f, 55, 8, 1952);
    			add_location(li18, file$f, 51, 6, 1757);
    			add_location(br3, file$f, 77, 6, 2809);
    			add_location(b21, file$f, 79, 8, 2835);
    			add_location(li19, file$f, 78, 6, 2822);
    			add_location(ul2, file$f, 23, 4, 677);
    			add_location(li20, file$f, 18, 2, 502);
    			add_location(ul3, file$f, 14, 0, 413);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_OnErrorAnatomy",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* docsproj/components/pages/SCR_ConfigurationOnError.svelte generated by Svelte v3.37.0 */
    const file$e = "docsproj/components/pages/SCR_ConfigurationOnError.svelte";

    // (19:12) <SCR_ROUTER_LINK       to={{ name: "routeComponentComponentsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$7(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Route Component Components";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$e, 22, 6, 940);
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
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(19:12) <SCR_ROUTER_LINK       to={{ name: \\\"routeComponentComponentsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (53:2) <SCR_PageFooter>
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
    			add_location(div0, file$e, 54, 6, 2028);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$e, 53, 4, 2004);
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
    		source: "(53:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
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
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_onerroranatomy = new SCR_OnErrorAnatomy({ $$inline: true });

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
    			add_location(h4, file$e, 8, 2, 307);
    			add_location(b0, file$e, 10, 8, 404);
    			add_location(br0, file$e, 12, 4, 520);
    			add_location(br1, file$e, 13, 4, 531);
    			add_location(br2, file$e, 17, 4, 771);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$e, 9, 2, 367);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$e, 27, 0, 1086);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$e, 30, 0, 1221);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$e, 25, 2, 1060);
    			add_location(br3, file$e, 33, 2, 1380);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$e, 36, 2, 1417);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$e, 41, 4, 1619);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$e, 40, 2, 1587);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$e, 43, 2, 1700);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$e, 7, 0, 282);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_ConfigurationOnError",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    var SCR_ConfigurationOnError$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_ConfigurationOnError
    });

    /* docsproj/components/pages/SCR_RouteObjectProperties.svelte generated by Svelte v3.37.0 */
    const file$d = "docsproj/components/pages/SCR_RouteObjectProperties.svelte";

    // (511:2) <SCR_PageFooter>
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
    			add_location(div0, file$d, 512, 6, 16936);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$d, 511, 4, 16912);
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
    		source: "(511:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
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
    	let b3;
    	let t27;
    	let br6;
    	let t28;
    	let br7;
    	let t29;
    	let br8;
    	let t30;
    	let b4;
    	let t32;
    	let br9;
    	let t33;
    	let br10;
    	let t34;
    	let br11;
    	let t35;
    	let br12;
    	let t36;
    	let b5;
    	let t38;
    	let br13;
    	let t39;
    	let br14;
    	let t40;
    	let br15;
    	let t41;
    	let b6;
    	let t43;
    	let b7;
    	let t45;
    	let br16;
    	let t46;
    	let br17;
    	let t47;
    	let br18;
    	let t48;
    	let b8;
    	let t50;
    	let br19;
    	let t51;
    	let br20;
    	let t52;
    	let t53;
    	let pre1;
    	let b9;
    	let t55;
    	let b10;
    	let t57;
    	let b11;
    	let t59;
    	let b12;
    	let t61;
    	let b13;
    	let t63;
    	let b14;
    	let t65;
    	let t66;
    	let hr2;
    	let t67;
    	let h43;
    	let t69;
    	let p3;
    	let t70;
    	let b15;
    	let t72;
    	let br21;
    	let t73;
    	let br22;
    	let t74;
    	let t75;
    	let pre2;
    	let b16;
    	let t77;
    	let b17;
    	let t79;
    	let b18;
    	let t81;
    	let t82;
    	let hr3;
    	let t83;
    	let h44;
    	let t85;
    	let p4;
    	let t86;
    	let b19;
    	let t88;
    	let br23;
    	let t89;
    	let br24;
    	let t90;
    	let t91;
    	let pre3;
    	let b20;
    	let t93;
    	let b21;
    	let t95;
    	let t96;
    	let hr4;
    	let t97;
    	let h45;
    	let t99;
    	let p5;
    	let t100;
    	let b22;
    	let t102;
    	let br25;
    	let t103;
    	let br26;
    	let t104;
    	let t105;
    	let pre4;
    	let b23;
    	let t107;
    	let b24;
    	let t109;
    	let b25;
    	let t111;
    	let t112;
    	let hr5;
    	let t113;
    	let h46;
    	let t115;
    	let p6;
    	let t116;
    	let b26;
    	let t118;
    	let br27;
    	let t119;
    	let br28;
    	let t120;
    	let t121;
    	let pre5;
    	let b27;
    	let t123;
    	let b28;
    	let t125;
    	let t126;
    	let hr6;
    	let t127;
    	let h47;
    	let t129;
    	let p7;
    	let t130;
    	let b29;
    	let t132;
    	let t133;
    	let pre6;
    	let b30;
    	let t135;
    	let b31;
    	let t137;
    	let b32;
    	let t139;
    	let t140;
    	let hr7;
    	let t141;
    	let h48;
    	let t143;
    	let p8;
    	let t144;
    	let b33;
    	let t146;
    	let t147;
    	let pre7;
    	let b34;
    	let t149;
    	let b35;
    	let t151;
    	let t152;
    	let hr8;
    	let t153;
    	let h49;
    	let t155;
    	let p9;
    	let t156;
    	let b36;
    	let t158;
    	let br29;
    	let t159;
    	let t160;
    	let pre8;
    	let b37;
    	let t162;
    	let t163;
    	let hr9;
    	let t164;
    	let h410;
    	let t166;
    	let p10;
    	let t167;
    	let b38;
    	let t169;
    	let br30;
    	let t170;
    	let br31;
    	let t171;
    	let br32;
    	let t172;
    	let t173;
    	let pre9;
    	let b39;
    	let t175;
    	let t176;
    	let hr10;
    	let t177;
    	let h411;
    	let t179;
    	let p11;
    	let t180;
    	let b40;
    	let t182;
    	let t183;
    	let pre10;
    	let b41;
    	let t185;
    	let t186;
    	let hr11;
    	let t187;
    	let h412;
    	let t189;
    	let p12;
    	let t190;
    	let b42;
    	let t192;
    	let t193;
    	let pre11;
    	let b43;
    	let t195;
    	let t196;
    	let hr12;
    	let t197;
    	let h413;
    	let t199;
    	let p13;
    	let t200;
    	let b44;
    	let t202;
    	let b45;
    	let t204;
    	let t205;
    	let pre12;
    	let b46;
    	let t207;
    	let t208;
    	let hr13;
    	let t209;
    	let h414;
    	let t211;
    	let p14;
    	let t212;
    	let b47;
    	let t214;
    	let t215;
    	let pre13;
    	let b48;
    	let t217;
    	let t218;
    	let hr14;
    	let t219;
    	let h415;
    	let t221;
    	let p15;
    	let t222;
    	let b49;
    	let t224;
    	let t225;
    	let pre14;
    	let b50;
    	let t227;
    	let t228;
    	let hr15;
    	let t229;
    	let h416;
    	let t231;
    	let p16;
    	let t232;
    	let b51;
    	let t234;
    	let br33;
    	let t235;
    	let t236;
    	let pre15;
    	let b52;
    	let t238;
    	let t239;
    	let hr16;
    	let t240;
    	let h417;
    	let t242;
    	let p17;
    	let t243;
    	let b53;
    	let t245;
    	let br34;
    	let t246;
    	let br35;
    	let t247;
    	let t248;
    	let pre16;
    	let b54;
    	let t250;
    	let t251;
    	let p18;
    	let t253;
    	let center;
    	let small;
    	let t255;
    	let pre17;
    	let t257;
    	let scr_pagefooter;
    	let current;

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
    			t21 = text(" is mandatory and it is the path to route to. This property is Case Sensitive.\n    ");
    			br2 = element("br");
    			t22 = space();
    			br3 = element("br");
    			t23 = text("\n    As it is an identification property must be unique. If some route is declared\n    with the same path, it will always find the first route with that path and route\n    to it.\n    ");
    			br4 = element("br");
    			t24 = text("\n    Simple declaration:\n    ");
    			br5 = element("br");
    			t25 = space();
    			b3 = element("b");
    			b3.textContent = "path: \"/path/to/my/route\",";
    			t27 = space();
    			br6 = element("br");
    			t28 = space();
    			br7 = element("br");
    			t29 = text("\n    You can use regex in your route like \":myVar\". For example:\n    ");
    			br8 = element("br");
    			t30 = space();
    			b4 = element("b");
    			b4.textContent = "path: \"/path/:someVar/my/route/:someOtherVar\",";
    			t32 = space();
    			br9 = element("br");
    			t33 = space();
    			br10 = element("br");
    			t34 = text("\n    You can use any route wildcard \"*\" in your route. For example:\n    ");
    			br11 = element("br");
    			t35 = text("\n    To match any route:\n    ");
    			br12 = element("br");
    			t36 = space();
    			b5 = element("b");
    			b5.textContent = "path: \"*\",";
    			t38 = space();
    			br13 = element("br");
    			t39 = space();
    			br14 = element("br");
    			t40 = text("\n    To match a section of route:\n    ");
    			br15 = element("br");
    			t41 = space();
    			b6 = element("b");
    			b6.textContent = "path: \"/path/*\",";
    			t43 = text(" or ");
    			b7 = element("b");
    			b7.textContent = "path: \"/path/prefixValu*\",";
    			t45 = space();
    			br16 = element("br");
    			t46 = space();
    			br17 = element("br");
    			t47 = text("\n    To match section route with param paths:\n    ");
    			br18 = element("br");
    			t48 = space();
    			b8 = element("b");
    			b8.textContent = "path: \"/path/prefixValu*/:somePathParamValue\",";
    			t50 = space();
    			br19 = element("br");
    			t51 = space();
    			br20 = element("br");
    			t52 = text("\n    It will be made available on all beforeEnter Functions, After Enter Function\n    and Components;");
    			t53 = space();
    			pre1 = element("pre");
    			b9 = element("b");
    			b9.textContent = "// ## Route Path\n// ## The path identifying this route\n// ## String - Obrigatory\n// ## Can declare regex like /test1/:paramA/testRegexPathParam2/:paramB\n// ## The regex must have the format \":string\"\n// ## Can declare any route wildcard like /test1/:paramA/*/:paramB\n// ## This property value is Case Sensitive.\n// ## Default value: none";
    			t55 = text("\n{\n  path: \"/path/to/my/route\",\n\n  ");
    			b10 = element("b");
    			b10.textContent = "// OR Can declare regex path";
    			t57 = text("\n  path: \"/path/:to/:my/route\",\n\n  ");
    			b11 = element("b");
    			b11.textContent = "// it will be made available on all beforeEnter Functions, After Enter Function and Component\n  // pathParams: {\n  //  to: \"myroutedefinedvalue\"\n  //  my: \"myroutedefinedvalue\"\n  // }";
    			t59 = text("\n\n  ");
    			b12 = element("b");
    			b12.textContent = "// OR Can declare regex path and any route wildcard";
    			t61 = text("\n  path: \"/path/:to/*/route\",\n\n  ");
    			b13 = element("b");
    			b13.textContent = "// it will be made available on all beforeEnter Functions, After Enter Function and Component\n  // pathParams: {\n  //  to: \"myroutedefinedvalue\"\n  // }";
    			t63 = text("\n\n  ");
    			b14 = element("b");
    			b14.textContent = "// OR Can declare to Any Route to be matched with wildcard";
    			t65 = text("\n  path: \"*\",\n \n}");
    			t66 = space();
    			hr2 = element("hr");
    			t67 = space();
    			h43 = element("h4");
    			h43.textContent = "Component";
    			t69 = space();
    			p3 = element("p");
    			t70 = text("The ");
    			b15 = element("b");
    			b15.textContent = "component";
    			t72 = text(" is partially mandatory. This is because if the route\n    only redirects, it will not use the loaded component.\n    ");
    			br21 = element("br");
    			t73 = space();
    			br22 = element("br");
    			t74 = text("\n    The component specified will be included inside the default slot of the Layout\n    Component.");
    			t75 = space();
    			pre2 = element("pre");
    			b16 = element("b");
    			b16.textContent = "// ## Component - the loaded component that is going to be used \n// for this route\n// ## Function - Imported component for this route\n// ## Default value: none";
    			t77 = text("\n\n");
    			b17 = element("b");
    			b17.textContent = "// Import your component";
    			t79 = text("\nimport SCR_C1 from \"./testComponents/SCR_C1.svelte\";\n\n{\n  ");
    			b18 = element("b");
    			b18.textContent = "// Setting your route component";
    			t81 = text("\n  component: SCR_C1,\n}");
    			t82 = space();
    			hr3 = element("hr");
    			t83 = space();
    			h44 = element("h4");
    			h44.textContent = "Lazy Load Component";
    			t85 = space();
    			p4 = element("p");
    			t86 = text("The ");
    			b19 = element("b");
    			b19.textContent = "lazyLoadComponent";
    			t88 = text(" is partially mandatory. This is because if the\n    route only redirects, it will not load any component.\n    ");
    			br23 = element("br");
    			t89 = space();
    			br24 = element("br");
    			t90 = text("\n    The component specified will be included inside the default slot of the Layout\n    Component.");
    			t91 = space();
    			pre3 = element("pre");
    			b20 = element("b");
    			b20.textContent = "// ## Lazy Load Component - the component that must be loaded to be used \n// ## for this route\n// ## Function - Function to load the component for this route\n// ## Default value: none";
    			t93 = text("\n\n{\n  ");
    			b21 = element("b");
    			b21.textContent = "// Lazy loading your route component";
    			t95 = text("\n  lazyLoadComponent: () => import(\"./testComponents/SCR_C1.svelte\"),\n}");
    			t96 = space();
    			hr4 = element("hr");
    			t97 = space();
    			h45 = element("h4");
    			h45.textContent = "Layout Component";
    			t99 = space();
    			p5 = element("p");
    			t100 = text("The ");
    			b22 = element("b");
    			b22.textContent = "layoutComponent";
    			t102 = text(" is a custom loaded layout to use with this\n    specific route. When set it will override any global layout set for this\n    route only.\n    ");
    			br25 = element("br");
    			t103 = space();
    			br26 = element("br");
    			t104 = text("\n    The layout component specified must have a default slot declared to include route\n    component.");
    			t105 = space();
    			pre4 = element("pre");
    			b23 = element("b");
    			b23.textContent = "// ## Layout Component - the layout component that is going to be used \n// ## for this route\n// ## Function - Imported layout component for this route\n// ## Default value: none";
    			t107 = text("\n\n");
    			b24 = element("b");
    			b24.textContent = "// Import your component";
    			t109 = text("\nimport SRC_Layout from \"./testComponents/SRC_Layout.svelte\";\n\n{\n  ");
    			b25 = element("b");
    			b25.textContent = "// Setting your route layout component";
    			t111 = text("\n  layoutComponent: SRC_Layout,\n}");
    			t112 = space();
    			hr5 = element("hr");
    			t113 = space();
    			h46 = element("h4");
    			h46.textContent = "Lazy Load Layout Component";
    			t115 = space();
    			p6 = element("p");
    			t116 = text("The ");
    			b26 = element("b");
    			b26.textContent = "lazyLoadLayoutComponent";
    			t118 = text(" is a custom layout to be loaded to use\n    with this specific route. When set it will override any global layout set\n    for this route only.\n    ");
    			br27 = element("br");
    			t119 = space();
    			br28 = element("br");
    			t120 = text("\n    The lazy layout component specified must have a default slot declared to include\n    route component.");
    			t121 = space();
    			pre5 = element("pre");
    			b27 = element("b");
    			b27.textContent = "// ## Lazy Load Layout Component - the layout component that must be loaded to be used \n// ## for this route\n// ## Function - Function to load the layout component for this route\n// ## Default value: none";
    			t123 = text("\n\n{\n  ");
    			b28 = element("b");
    			b28.textContent = "// Lazy loading your route layout component";
    			t125 = text("\n  lazyLoadLayoutComponent: () => import(\"./testComponents/SRC_Layout.svelte\"),\n}");
    			t126 = space();
    			hr6 = element("hr");
    			t127 = space();
    			h47 = element("h4");
    			h47.textContent = "Loading Component";
    			t129 = space();
    			p7 = element("p");
    			t130 = text("The ");
    			b29 = element("b");
    			b29.textContent = "loadingComponent";
    			t132 = text(" is a custom loaded loading component to use with\n    this specific route. When set it will override any global loading component set\n    for this route only.");
    			t133 = space();
    			pre6 = element("pre");
    			b30 = element("b");
    			b30.textContent = "// ## Loading Component - the loading component that is going to be used \n// ## for this route\n// ## Function - Imported loading component for this route\n// ## Default value: none";
    			t135 = text("\n\n");
    			b31 = element("b");
    			b31.textContent = "// Import your component";
    			t137 = text("\nimport SRC_Loading from \"./testComponents/SRC_Loading.svelte\";\n\n{\n  ");
    			b32 = element("b");
    			b32.textContent = "// Setting your route loading component";
    			t139 = text("\n  loadingComponent: SRC_Loading,\n}");
    			t140 = space();
    			hr7 = element("hr");
    			t141 = space();
    			h48 = element("h4");
    			h48.textContent = "Lazy Load Loading Component";
    			t143 = space();
    			p8 = element("p");
    			t144 = text("The ");
    			b33 = element("b");
    			b33.textContent = "lazyLoadLoadingComponent";
    			t146 = text(" is a custom loading component to be loaded\n    to use with this specific route. When set it will override any global loading\n    component set for this route only.");
    			t147 = space();
    			pre7 = element("pre");
    			b34 = element("b");
    			b34.textContent = "// ## Lazy Load Loading Component - the loading component that must be loaded to be used \n// ## for this route\n// ## Function - Function to load the loading component for this route\n// ## Default value: none";
    			t149 = text("\n\n{\n  ");
    			b35 = element("b");
    			b35.textContent = "// Lazy loading your route loading component";
    			t151 = text("\n  lazyLoadLoadingComponent: () => import(\"./testComponents/SRC_Loading.svelte\"),\n}");
    			t152 = space();
    			hr8 = element("hr");
    			t153 = space();
    			h49 = element("h4");
    			h49.textContent = "Params";
    			t155 = space();
    			p9 = element("p");
    			t156 = text("The ");
    			b36 = element("b");
    			b36.textContent = "params";
    			t158 = text(" option is an object that must be available on before enter\n    functions or even the components.\n    ");
    			br29 = element("br");
    			t159 = text("\n    It will be available at any moment for you. Of course this is some fixed values.\n    See the payload param in the before enter sections to pass some custom values\n    between functions.");
    			t160 = space();
    			pre8 = element("pre");
    			b37 = element("b");
    			b37.textContent = "// ## Params - all the params the should be available\n// for this route on any Before Enter Execution or \n// After Before Enter Execution\n// ## Object\n// ## Default value: {}";
    			t162 = text("\n{\n  params: { \n    myParam: \"My Custom Param\", \n  },\n}");
    			t163 = space();
    			hr9 = element("hr");
    			t164 = space();
    			h410 = element("h4");
    			h410.textContent = "Loading Props";
    			t166 = space();
    			p10 = element("p");
    			t167 = text("The ");
    			b38 = element("b");
    			b38.textContent = "loadingProps";
    			t169 = text(" option is an object that will be available on\n    loading component.\n    ");
    			br30 = element("br");
    			t170 = text("\n    When routing the user may be waiting for some request to return and for that\n    SCR makes available a loading component. Of course you can override it and you\n    are encouraged to do so.\n    ");
    			br31 = element("br");
    			t171 = space();
    			br32 = element("br");
    			t172 = text("\n    Any properties set here will be delivered to the loading component.");
    			t173 = space();
    			pre9 = element("pre");
    			b39 = element("b");
    			b39.textContent = "// ## Loading Props - all props that must be available to\n// loading component when it is triggered\n// ## Object\n// ## Default value: {}";
    			t175 = text("\n{\n  loadingProps: { loadingText: \"Carregando...\" },\n}");
    			t176 = space();
    			hr10 = element("hr");
    			t177 = space();
    			h411 = element("h4");
    			h411.textContent = "Ignore Layout";
    			t179 = space();
    			p11 = element("p");
    			t180 = text("The ");
    			b40 = element("b");
    			b40.textContent = "ignoreLayout";
    			t182 = text(" option when set to true, ignores any layout defined to\n    this specific route.");
    			t183 = space();
    			pre10 = element("pre");
    			b41 = element("b");
    			b41.textContent = "// ## Ignore Layout - if should ignore layout component\n// ## when you do not want to use global or local layout component\n// ## Boolean\n// ## Default value: false";
    			t185 = text("\n{\n  ignoreLayout: false,\n}");
    			t186 = space();
    			hr11 = element("hr");
    			t187 = space();
    			h412 = element("h4");
    			h412.textContent = "Ignore Scroll";
    			t189 = space();
    			p12 = element("p");
    			t190 = text("The ");
    			b42 = element("b");
    			b42.textContent = "ignoreScroll";
    			t192 = text(" option when set to true, ignores any scroll behaviour\n    defined.");
    			t193 = space();
    			pre11 = element("pre");
    			b43 = element("b");
    			b43.textContent = "// ## Ignore Scroll - if this route should ignore scrolling\n// ## Boolean\n// ## Default value: false";
    			t195 = text("\n{\n  ignoreScroll: false,\n}");
    			t196 = space();
    			hr12 = element("hr");
    			t197 = space();
    			h413 = element("h4");
    			h413.textContent = "Scroll Props";
    			t199 = space();
    			p13 = element("p");
    			t200 = text("The ");
    			b44 = element("b");
    			b44.textContent = "scrollProps";
    			t202 = text(" option overrides the store ");
    			b45 = element("b");
    			b45.textContent = "scrollProps";
    			t204 = text(" configuration\n    for this specific route.");
    			t205 = space();
    			pre12 = element("pre");
    			b46 = element("b");
    			b46.textContent = "// ## Scroll Props\n// ## The scrolling props on entering the route if enabled\n// ## Default Values: \n// ## Object\n// ## Default value: configuration store";
    			t207 = text("\n{\n  scrollProps: {\n    top: 0,\n    left: 0,\n    behavior: \"smooth\",\n    timeout: 10, // timeout must be greater than 10 milliseconds\n  },\n}");
    			t208 = space();
    			hr13 = element("hr");
    			t209 = space();
    			h414 = element("h4");
    			h414.textContent = "Title";
    			t211 = space();
    			p14 = element("p");
    			t212 = text("The ");
    			b47 = element("b");
    			b47.textContent = "title";
    			t214 = text(" option sets when enters the route the page title.");
    			t215 = space();
    			pre13 = element("pre");
    			b48 = element("b");
    			b48.textContent = "// ## Title - it defines the route title\n// ## String\n// ## Default value: none";
    			t217 = text("\n{\n  title: \"Route Object - Options\",\n}");
    			t218 = space();
    			hr14 = element("hr");
    			t219 = space();
    			h415 = element("h4");
    			h415.textContent = "Ignore Global Before Function";
    			t221 = space();
    			p15 = element("p");
    			t222 = text("The ");
    			b49 = element("b");
    			b49.textContent = "ignoreGlobalBeforeFunction";
    			t224 = text(" option when is true will not execute any\n    Global Before Enter functions for this specific route.");
    			t225 = space();
    			pre14 = element("pre");
    			b50 = element("b");
    			b50.textContent = "// ## Ignore Global Before Function - \n// ## if should ignore defined global before function \n// ## Boolean\n// ## Default value: false";
    			t227 = text("\n{\n  ignoreGlobalBeforeFunction: false,\n}");
    			t228 = space();
    			hr15 = element("hr");
    			t229 = space();
    			h416 = element("h4");
    			h416.textContent = "Execute Route BEF Before Global BEF";
    			t231 = space();
    			p16 = element("p");
    			t232 = text("The ");
    			b51 = element("b");
    			b51.textContent = "executeRouteBEFBeforeGlobalBEF";
    			t234 = text(" option when is true will modify\n    the default behaviour of the SCR. The SCR always runs Global Before Enter\n    Functions before Route Before Enter Functions, but is different when this\n    option is true.\n    ");
    			br33 = element("br");
    			t235 = text("\n    When set to true it will execute Route Before Functions before Global Before\n    Functions.");
    			t236 = space();
    			pre15 = element("pre");
    			b52 = element("b");
    			b52.textContent = "// ## Execute Route Before Enter Function Before Global Before Function \n// ## if should execute route before function sequence before \n// ## global before enter execution\n// ## Boolean \n// ## Default value: false";
    			t238 = text("\n{\n  executeRouteBEFBeforeGlobalBEF: false,\n}");
    			t239 = space();
    			hr16 = element("hr");
    			t240 = space();
    			h417 = element("h4");
    			h417.textContent = "Force Reload";
    			t242 = space();
    			p17 = element("p");
    			t243 = text("The ");
    			b53 = element("b");
    			b53.textContent = "forceReload";
    			t245 = text(" option when is true will not reload the route when\n    the route is already loaded. The user may click in a button that pushes to\n    the current route. The default behaviour is just not to reload the route.\n    ");
    			br34 = element("br");
    			t246 = space();
    			br35 = element("br");
    			t247 = text("\n    But maybe this is a feature you want to execute.");
    			t248 = space();
    			pre16 = element("pre");
    			b54 = element("b");
    			b54.textContent = "// ## Force Reload - when in opened route try to push the same route\n// by using pushRoute function\n// When enabled it will reload the current route as if it was not opened\n// ## Boolean\n// ## Default value: false";
    			t250 = text("\n{\n  forceReload: false,\n}");
    			t251 = space();
    			p18 = element("p");
    			p18.textContent = "So that is it for this section. But it is not the end of the Route Options.\n    See the next section to more info.";
    			t253 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t255 = space();
    			pre17 = element("pre");
    			pre17.textContent = "{\n    name: \"routeObjectOptionsRoute\",\n    path: \"/svelte-client-router/routeObjectOptions\",\n    lazyLoadComponent: () => import(\"./docs/pages/SCR_RouteObjectProperties.svelte\"),\n    title: \"SCR - Route Object - Options\",\n}";
    			t257 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$d, 6, 2, 176);
    			add_location(br0, file$d, 10, 4, 368);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$d, 7, 2, 228);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$d, 15, 2, 585);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$d, 16, 2, 609);
    			add_location(b0, file$d, 18, 8, 677);
    			add_location(br1, file$d, 20, 4, 770);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$d, 17, 2, 640);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$d, 27, 0, 990);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$d, 25, 2, 964);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$d, 39, 2, 1353);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$d, 40, 2, 1377);
    			add_location(b2, file$d, 42, 8, 1445);
    			add_location(br2, file$d, 43, 4, 1539);
    			add_location(br3, file$d, 44, 4, 1550);
    			add_location(br4, file$d, 48, 4, 1739);
    			add_location(br5, file$d, 50, 4, 1774);
    			add_location(b3, file$d, 51, 4, 1785);
    			add_location(br6, file$d, 52, 4, 1823);
    			add_location(br7, file$d, 53, 4, 1834);
    			add_location(br8, file$d, 55, 4, 1909);
    			add_location(b4, file$d, 56, 4, 1920);
    			add_location(br9, file$d, 57, 4, 1978);
    			add_location(br10, file$d, 58, 4, 1989);
    			add_location(br11, file$d, 60, 4, 2067);
    			add_location(br12, file$d, 62, 4, 2102);
    			add_location(b5, file$d, 63, 4, 2113);
    			add_location(br13, file$d, 64, 4, 2135);
    			add_location(br14, file$d, 65, 4, 2146);
    			add_location(br15, file$d, 67, 4, 2190);
    			add_location(b6, file$d, 68, 4, 2201);
    			add_location(b7, file$d, 68, 31, 2228);
    			add_location(br16, file$d, 69, 4, 2266);
    			add_location(br17, file$d, 70, 4, 2277);
    			add_location(br18, file$d, 72, 4, 2333);
    			add_location(b8, file$d, 73, 4, 2344);
    			add_location(br19, file$d, 74, 4, 2402);
    			add_location(br20, file$d, 75, 4, 2413);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$d, 41, 2, 1408);
    			attr_dev(b9, "class", "scr-b");
    			add_location(b9, file$d, 81, 0, 2556);
    			attr_dev(b10, "class", "scr-b");
    			add_location(b10, file$d, 94, 2, 2956);
    			attr_dev(b11, "class", "scr-b");
    			add_location(b11, file$d, 99, 2, 3042);
    			attr_dev(b12, "class", "scr-b");
    			add_location(b12, file$d, 107, 2, 3264);
    			attr_dev(b13, "class", "scr-b");
    			add_location(b13, file$d, 112, 2, 3371);
    			attr_dev(b14, "class", "scr-b");
    			add_location(b14, file$d, 119, 2, 3563);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$d, 79, 2, 2530);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$d, 128, 2, 3858);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$d, 129, 2, 3882);
    			add_location(b15, file$d, 131, 8, 3955);
    			add_location(br21, file$d, 133, 4, 4087);
    			add_location(br22, file$d, 134, 4, 4098);
    			attr_dev(p3, "class", "scr-text-justify");
    			add_location(p3, file$d, 130, 2, 3918);
    			attr_dev(b16, "class", "scr-b");
    			add_location(b16, file$d, 140, 0, 4238);
    			attr_dev(b17, "class", "scr-b");
    			add_location(b17, file$d, 147, 0, 4422);
    			attr_dev(b18, "class", "scr-b");
    			add_location(b18, file$d, 151, 2, 4531);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$d, 138, 2, 4212);
    			attr_dev(hr3, "class", "scr-hr");
    			add_location(hr3, file$d, 157, 2, 4799);
    			attr_dev(h44, "class", "scr-h4");
    			add_location(h44, file$d, 158, 2, 4823);
    			add_location(b19, file$d, 160, 8, 4906);
    			add_location(br23, file$d, 162, 4, 5040);
    			add_location(br24, file$d, 163, 4, 5051);
    			attr_dev(p4, "class", "scr-text-justify");
    			add_location(p4, file$d, 159, 2, 4869);
    			attr_dev(b20, "class", "scr-b");
    			add_location(b20, file$d, 169, 0, 5191);
    			attr_dev(b21, "class", "scr-b");
    			add_location(b21, file$d, 177, 2, 5408);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$d, 167, 2, 5165);
    			attr_dev(hr4, "class", "scr-hr");
    			add_location(hr4, file$d, 183, 2, 5731);
    			attr_dev(h45, "class", "scr-h4");
    			add_location(h45, file$d, 184, 2, 5755);
    			add_location(b22, file$d, 186, 8, 5835);
    			add_location(br25, file$d, 189, 4, 5998);
    			add_location(br26, file$d, 190, 4, 6009);
    			attr_dev(p5, "class", "scr-text-justify");
    			add_location(p5, file$d, 185, 2, 5798);
    			attr_dev(b23, "class", "scr-b");
    			add_location(b23, file$d, 196, 0, 6152);
    			attr_dev(b24, "class", "scr-b");
    			add_location(b24, file$d, 203, 0, 6353);
    			attr_dev(b25, "class", "scr-b");
    			add_location(b25, file$d, 207, 2, 6470);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$d, 194, 2, 6126);
    			attr_dev(hr5, "class", "scr-hr");
    			add_location(hr5, file$d, 213, 2, 6757);
    			attr_dev(h46, "class", "scr-h4");
    			add_location(h46, file$d, 214, 2, 6781);
    			add_location(b26, file$d, 216, 8, 6871);
    			add_location(br27, file$d, 219, 4, 7048);
    			add_location(br28, file$d, 220, 4, 7059);
    			attr_dev(p6, "class", "scr-text-justify");
    			add_location(p6, file$d, 215, 2, 6834);
    			attr_dev(b27, "class", "scr-b");
    			add_location(b27, file$d, 226, 0, 7207);
    			attr_dev(b28, "class", "scr-b");
    			add_location(b28, file$d, 234, 2, 7445);
    			attr_dev(pre5, "class", "scr-pre");
    			add_location(pre5, file$d, 224, 2, 7181);
    			attr_dev(hr6, "class", "scr-hr");
    			add_location(hr6, file$d, 240, 2, 7785);
    			attr_dev(h47, "class", "scr-h4");
    			add_location(h47, file$d, 241, 2, 7809);
    			add_location(b29, file$d, 243, 8, 7890);
    			attr_dev(p7, "class", "scr-text-justify");
    			add_location(p7, file$d, 242, 2, 7853);
    			attr_dev(b30, "class", "scr-b");
    			add_location(b30, file$d, 249, 0, 8107);
    			attr_dev(b31, "class", "scr-b");
    			add_location(b31, file$d, 256, 0, 8311);
    			attr_dev(b32, "class", "scr-b");
    			add_location(b32, file$d, 260, 2, 8430);
    			attr_dev(pre6, "class", "scr-pre");
    			add_location(pre6, file$d, 247, 2, 8081);
    			attr_dev(hr7, "class", "scr-hr");
    			add_location(hr7, file$d, 266, 2, 8721);
    			attr_dev(h48, "class", "scr-h4");
    			add_location(h48, file$d, 267, 2, 8745);
    			add_location(b33, file$d, 269, 8, 8836);
    			attr_dev(p8, "class", "scr-text-justify");
    			add_location(p8, file$d, 268, 2, 8799);
    			attr_dev(b34, "class", "scr-b");
    			add_location(b34, file$d, 275, 0, 9067);
    			attr_dev(b35, "class", "scr-b");
    			add_location(b35, file$d, 283, 2, 9308);
    			attr_dev(pre7, "class", "scr-pre");
    			add_location(pre7, file$d, 273, 2, 9041);
    			attr_dev(hr8, "class", "scr-hr");
    			add_location(hr8, file$d, 288, 2, 9561);
    			attr_dev(h49, "class", "scr-h4");
    			add_location(h49, file$d, 289, 2, 9585);
    			add_location(b36, file$d, 291, 8, 9655);
    			add_location(br29, file$d, 293, 4, 9770);
    			attr_dev(p9, "class", "scr-text-justify");
    			add_location(p9, file$d, 290, 2, 9618);
    			attr_dev(b37, "class", "scr-b");
    			add_location(b37, file$d, 300, 0, 10002);
    			attr_dev(pre8, "class", "scr-pre");
    			add_location(pre8, file$d, 298, 2, 9976);
    			attr_dev(hr9, "class", "scr-hr");
    			add_location(hr9, file$d, 315, 2, 10474);
    			attr_dev(h410, "class", "scr-h4");
    			add_location(h410, file$d, 316, 2, 10498);
    			add_location(b38, file$d, 318, 8, 10575);
    			add_location(br30, file$d, 320, 4, 10668);
    			add_location(br31, file$d, 324, 4, 10872);
    			add_location(br32, file$d, 325, 4, 10883);
    			attr_dev(p10, "class", "scr-text-justify");
    			add_location(p10, file$d, 317, 2, 10538);
    			attr_dev(b39, "class", "scr-b");
    			add_location(b39, file$d, 330, 0, 10997);
    			attr_dev(pre9, "class", "scr-pre");
    			add_location(pre9, file$d, 328, 2, 10971);
    			attr_dev(hr10, "class", "scr-hr");
    			add_location(hr10, file$d, 342, 2, 11430);
    			attr_dev(h411, "class", "scr-h4");
    			add_location(h411, file$d, 343, 2, 11454);
    			add_location(b40, file$d, 345, 8, 11531);
    			attr_dev(p11, "class", "scr-text-justify");
    			add_location(p11, file$d, 344, 2, 11494);
    			attr_dev(b41, "class", "scr-b");
    			add_location(b41, file$d, 350, 0, 11666);
    			attr_dev(pre10, "class", "scr-pre");
    			add_location(pre10, file$d, 348, 2, 11640);
    			attr_dev(hr11, "class", "scr-hr");
    			add_location(hr11, file$d, 362, 2, 12079);
    			attr_dev(h412, "class", "scr-h4");
    			add_location(h412, file$d, 363, 2, 12103);
    			add_location(b42, file$d, 365, 8, 12180);
    			attr_dev(p12, "class", "scr-text-justify");
    			add_location(p12, file$d, 364, 2, 12143);
    			attr_dev(b43, "class", "scr-b");
    			add_location(b43, file$d, 370, 0, 12302);
    			attr_dev(pre11, "class", "scr-pre");
    			add_location(pre11, file$d, 368, 2, 12276);
    			attr_dev(hr12, "class", "scr-hr");
    			add_location(hr12, file$d, 381, 2, 12652);
    			attr_dev(h413, "class", "scr-h4");
    			add_location(h413, file$d, 382, 2, 12676);
    			add_location(b44, file$d, 384, 8, 12752);
    			add_location(b45, file$d, 384, 54, 12798);
    			attr_dev(p13, "class", "scr-text-justify");
    			add_location(p13, file$d, 383, 2, 12715);
    			attr_dev(b46, "class", "scr-b");
    			add_location(b46, file$d, 389, 0, 12895);
    			attr_dev(pre12, "class", "scr-pre");
    			add_location(pre12, file$d, 387, 2, 12869);
    			attr_dev(hr13, "class", "scr-hr");
    			add_location(hr13, file$d, 407, 2, 13422);
    			attr_dev(h414, "class", "scr-h4");
    			add_location(h414, file$d, 408, 2, 13446);
    			add_location(b47, file$d, 410, 8, 13515);
    			attr_dev(p14, "class", "scr-text-justify");
    			add_location(p14, file$d, 409, 2, 13478);
    			attr_dev(b48, "class", "scr-b");
    			add_location(b48, file$d, 414, 0, 13613);
    			attr_dev(pre13, "class", "scr-pre");
    			add_location(pre13, file$d, 412, 2, 13587);
    			attr_dev(hr14, "class", "scr-hr");
    			add_location(hr14, file$d, 425, 2, 13954);
    			attr_dev(h415, "class", "scr-h4");
    			add_location(h415, file$d, 426, 2, 13978);
    			add_location(b49, file$d, 428, 8, 14071);
    			attr_dev(p15, "class", "scr-text-justify");
    			add_location(p15, file$d, 427, 2, 14034);
    			attr_dev(b50, "class", "scr-b");
    			add_location(b50, file$d, 433, 0, 14240);
    			attr_dev(pre14, "class", "scr-pre");
    			add_location(pre14, file$d, 431, 2, 14214);
    			attr_dev(hr15, "class", "scr-hr");
    			add_location(hr15, file$d, 445, 2, 14638);
    			attr_dev(h416, "class", "scr-h4");
    			add_location(h416, file$d, 446, 2, 14662);
    			add_location(b51, file$d, 448, 8, 14761);
    			add_location(br33, file$d, 452, 4, 15011);
    			attr_dev(p16, "class", "scr-text-justify");
    			add_location(p16, file$d, 447, 2, 14724);
    			attr_dev(b52, "class", "scr-b");
    			add_location(b52, file$d, 458, 0, 15149);
    			attr_dev(pre15, "class", "scr-pre");
    			add_location(pre15, file$d, 456, 2, 15123);
    			attr_dev(hr16, "class", "scr-hr");
    			add_location(hr16, file$d, 471, 2, 15630);
    			attr_dev(h417, "class", "scr-h4");
    			add_location(h417, file$d, 472, 2, 15654);
    			add_location(b53, file$d, 474, 8, 15730);
    			add_location(br34, file$d, 477, 4, 15961);
    			add_location(br35, file$d, 478, 4, 15972);
    			attr_dev(p17, "class", "scr-text-justify");
    			add_location(p17, file$d, 473, 2, 15693);
    			attr_dev(b54, "class", "scr-b");
    			add_location(b54, file$d, 483, 0, 16067);
    			attr_dev(pre16, "class", "scr-pre");
    			add_location(pre16, file$d, 481, 2, 16041);
    			attr_dev(p18, "class", "scr-text-justify");
    			add_location(p18, file$d, 494, 2, 16349);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$d, 499, 4, 16538);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$d, 498, 2, 16506);
    			attr_dev(pre17, "class", "scr-pre");
    			add_location(pre17, file$d, 501, 2, 16619);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$d, 5, 0, 151);
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
    			append_dev(p2, b3);
    			append_dev(p2, t27);
    			append_dev(p2, br6);
    			append_dev(p2, t28);
    			append_dev(p2, br7);
    			append_dev(p2, t29);
    			append_dev(p2, br8);
    			append_dev(p2, t30);
    			append_dev(p2, b4);
    			append_dev(p2, t32);
    			append_dev(p2, br9);
    			append_dev(p2, t33);
    			append_dev(p2, br10);
    			append_dev(p2, t34);
    			append_dev(p2, br11);
    			append_dev(p2, t35);
    			append_dev(p2, br12);
    			append_dev(p2, t36);
    			append_dev(p2, b5);
    			append_dev(p2, t38);
    			append_dev(p2, br13);
    			append_dev(p2, t39);
    			append_dev(p2, br14);
    			append_dev(p2, t40);
    			append_dev(p2, br15);
    			append_dev(p2, t41);
    			append_dev(p2, b6);
    			append_dev(p2, t43);
    			append_dev(p2, b7);
    			append_dev(p2, t45);
    			append_dev(p2, br16);
    			append_dev(p2, t46);
    			append_dev(p2, br17);
    			append_dev(p2, t47);
    			append_dev(p2, br18);
    			append_dev(p2, t48);
    			append_dev(p2, b8);
    			append_dev(p2, t50);
    			append_dev(p2, br19);
    			append_dev(p2, t51);
    			append_dev(p2, br20);
    			append_dev(p2, t52);
    			append_dev(div, t53);
    			append_dev(div, pre1);
    			append_dev(pre1, b9);
    			append_dev(pre1, t55);
    			append_dev(pre1, b10);
    			append_dev(pre1, t57);
    			append_dev(pre1, b11);
    			append_dev(pre1, t59);
    			append_dev(pre1, b12);
    			append_dev(pre1, t61);
    			append_dev(pre1, b13);
    			append_dev(pre1, t63);
    			append_dev(pre1, b14);
    			append_dev(pre1, t65);
    			append_dev(div, t66);
    			append_dev(div, hr2);
    			append_dev(div, t67);
    			append_dev(div, h43);
    			append_dev(div, t69);
    			append_dev(div, p3);
    			append_dev(p3, t70);
    			append_dev(p3, b15);
    			append_dev(p3, t72);
    			append_dev(p3, br21);
    			append_dev(p3, t73);
    			append_dev(p3, br22);
    			append_dev(p3, t74);
    			append_dev(div, t75);
    			append_dev(div, pre2);
    			append_dev(pre2, b16);
    			append_dev(pre2, t77);
    			append_dev(pre2, b17);
    			append_dev(pre2, t79);
    			append_dev(pre2, b18);
    			append_dev(pre2, t81);
    			append_dev(div, t82);
    			append_dev(div, hr3);
    			append_dev(div, t83);
    			append_dev(div, h44);
    			append_dev(div, t85);
    			append_dev(div, p4);
    			append_dev(p4, t86);
    			append_dev(p4, b19);
    			append_dev(p4, t88);
    			append_dev(p4, br23);
    			append_dev(p4, t89);
    			append_dev(p4, br24);
    			append_dev(p4, t90);
    			append_dev(div, t91);
    			append_dev(div, pre3);
    			append_dev(pre3, b20);
    			append_dev(pre3, t93);
    			append_dev(pre3, b21);
    			append_dev(pre3, t95);
    			append_dev(div, t96);
    			append_dev(div, hr4);
    			append_dev(div, t97);
    			append_dev(div, h45);
    			append_dev(div, t99);
    			append_dev(div, p5);
    			append_dev(p5, t100);
    			append_dev(p5, b22);
    			append_dev(p5, t102);
    			append_dev(p5, br25);
    			append_dev(p5, t103);
    			append_dev(p5, br26);
    			append_dev(p5, t104);
    			append_dev(div, t105);
    			append_dev(div, pre4);
    			append_dev(pre4, b23);
    			append_dev(pre4, t107);
    			append_dev(pre4, b24);
    			append_dev(pre4, t109);
    			append_dev(pre4, b25);
    			append_dev(pre4, t111);
    			append_dev(div, t112);
    			append_dev(div, hr5);
    			append_dev(div, t113);
    			append_dev(div, h46);
    			append_dev(div, t115);
    			append_dev(div, p6);
    			append_dev(p6, t116);
    			append_dev(p6, b26);
    			append_dev(p6, t118);
    			append_dev(p6, br27);
    			append_dev(p6, t119);
    			append_dev(p6, br28);
    			append_dev(p6, t120);
    			append_dev(div, t121);
    			append_dev(div, pre5);
    			append_dev(pre5, b27);
    			append_dev(pre5, t123);
    			append_dev(pre5, b28);
    			append_dev(pre5, t125);
    			append_dev(div, t126);
    			append_dev(div, hr6);
    			append_dev(div, t127);
    			append_dev(div, h47);
    			append_dev(div, t129);
    			append_dev(div, p7);
    			append_dev(p7, t130);
    			append_dev(p7, b29);
    			append_dev(p7, t132);
    			append_dev(div, t133);
    			append_dev(div, pre6);
    			append_dev(pre6, b30);
    			append_dev(pre6, t135);
    			append_dev(pre6, b31);
    			append_dev(pre6, t137);
    			append_dev(pre6, b32);
    			append_dev(pre6, t139);
    			append_dev(div, t140);
    			append_dev(div, hr7);
    			append_dev(div, t141);
    			append_dev(div, h48);
    			append_dev(div, t143);
    			append_dev(div, p8);
    			append_dev(p8, t144);
    			append_dev(p8, b33);
    			append_dev(p8, t146);
    			append_dev(div, t147);
    			append_dev(div, pre7);
    			append_dev(pre7, b34);
    			append_dev(pre7, t149);
    			append_dev(pre7, b35);
    			append_dev(pre7, t151);
    			append_dev(div, t152);
    			append_dev(div, hr8);
    			append_dev(div, t153);
    			append_dev(div, h49);
    			append_dev(div, t155);
    			append_dev(div, p9);
    			append_dev(p9, t156);
    			append_dev(p9, b36);
    			append_dev(p9, t158);
    			append_dev(p9, br29);
    			append_dev(p9, t159);
    			append_dev(div, t160);
    			append_dev(div, pre8);
    			append_dev(pre8, b37);
    			append_dev(pre8, t162);
    			append_dev(div, t163);
    			append_dev(div, hr9);
    			append_dev(div, t164);
    			append_dev(div, h410);
    			append_dev(div, t166);
    			append_dev(div, p10);
    			append_dev(p10, t167);
    			append_dev(p10, b38);
    			append_dev(p10, t169);
    			append_dev(p10, br30);
    			append_dev(p10, t170);
    			append_dev(p10, br31);
    			append_dev(p10, t171);
    			append_dev(p10, br32);
    			append_dev(p10, t172);
    			append_dev(div, t173);
    			append_dev(div, pre9);
    			append_dev(pre9, b39);
    			append_dev(pre9, t175);
    			append_dev(div, t176);
    			append_dev(div, hr10);
    			append_dev(div, t177);
    			append_dev(div, h411);
    			append_dev(div, t179);
    			append_dev(div, p11);
    			append_dev(p11, t180);
    			append_dev(p11, b40);
    			append_dev(p11, t182);
    			append_dev(div, t183);
    			append_dev(div, pre10);
    			append_dev(pre10, b41);
    			append_dev(pre10, t185);
    			append_dev(div, t186);
    			append_dev(div, hr11);
    			append_dev(div, t187);
    			append_dev(div, h412);
    			append_dev(div, t189);
    			append_dev(div, p12);
    			append_dev(p12, t190);
    			append_dev(p12, b42);
    			append_dev(p12, t192);
    			append_dev(div, t193);
    			append_dev(div, pre11);
    			append_dev(pre11, b43);
    			append_dev(pre11, t195);
    			append_dev(div, t196);
    			append_dev(div, hr12);
    			append_dev(div, t197);
    			append_dev(div, h413);
    			append_dev(div, t199);
    			append_dev(div, p13);
    			append_dev(p13, t200);
    			append_dev(p13, b44);
    			append_dev(p13, t202);
    			append_dev(p13, b45);
    			append_dev(p13, t204);
    			append_dev(div, t205);
    			append_dev(div, pre12);
    			append_dev(pre12, b46);
    			append_dev(pre12, t207);
    			append_dev(div, t208);
    			append_dev(div, hr13);
    			append_dev(div, t209);
    			append_dev(div, h414);
    			append_dev(div, t211);
    			append_dev(div, p14);
    			append_dev(p14, t212);
    			append_dev(p14, b47);
    			append_dev(p14, t214);
    			append_dev(div, t215);
    			append_dev(div, pre13);
    			append_dev(pre13, b48);
    			append_dev(pre13, t217);
    			append_dev(div, t218);
    			append_dev(div, hr14);
    			append_dev(div, t219);
    			append_dev(div, h415);
    			append_dev(div, t221);
    			append_dev(div, p15);
    			append_dev(p15, t222);
    			append_dev(p15, b49);
    			append_dev(p15, t224);
    			append_dev(div, t225);
    			append_dev(div, pre14);
    			append_dev(pre14, b50);
    			append_dev(pre14, t227);
    			append_dev(div, t228);
    			append_dev(div, hr15);
    			append_dev(div, t229);
    			append_dev(div, h416);
    			append_dev(div, t231);
    			append_dev(div, p16);
    			append_dev(p16, t232);
    			append_dev(p16, b51);
    			append_dev(p16, t234);
    			append_dev(p16, br33);
    			append_dev(p16, t235);
    			append_dev(div, t236);
    			append_dev(div, pre15);
    			append_dev(pre15, b52);
    			append_dev(pre15, t238);
    			append_dev(div, t239);
    			append_dev(div, hr16);
    			append_dev(div, t240);
    			append_dev(div, h417);
    			append_dev(div, t242);
    			append_dev(div, p17);
    			append_dev(p17, t243);
    			append_dev(p17, b53);
    			append_dev(p17, t245);
    			append_dev(p17, br34);
    			append_dev(p17, t246);
    			append_dev(p17, br35);
    			append_dev(p17, t247);
    			append_dev(div, t248);
    			append_dev(div, pre16);
    			append_dev(pre16, b54);
    			append_dev(pre16, t250);
    			append_dev(div, t251);
    			append_dev(div, p18);
    			append_dev(div, t253);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t255);
    			append_dev(div, pre17);
    			append_dev(div, t257);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteObjectProperties",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    var SCR_RouteObjectProperties$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteObjectProperties
    });

    /* docsproj/components/pages/SCR_RouteObjectBeforeEnter.svelte generated by Svelte v3.37.0 */
    const file$c = "docsproj/components/pages/SCR_RouteObjectBeforeEnter.svelte";

    // (29:12) <SCR_ROUTER_LINK       to={{ name: "routeObjectOptionsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$6(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Route Object Properties";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$c, 32, 6, 1467);
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
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(29:12) <SCR_ROUTER_LINK       to={{ name: \\\"routeObjectOptionsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (73:2) <SCR_PageFooter>
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
    			add_location(div0, file$c, 74, 6, 2802);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$c, 73, 4, 2778);
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
    		source: "(73:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
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
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_beforeenterrouteanatomy = new SCR_BeforeEnterRouteAnatomy({ $$inline: true });

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
    			add_location(h4, file$c, 8, 2, 325);
    			add_location(b0, file$c, 10, 8, 426);
    			add_location(b1, file$c, 12, 4, 564);
    			add_location(br0, file$c, 14, 4, 648);
    			add_location(br1, file$c, 15, 4, 659);
    			add_location(br2, file$c, 20, 4, 962);
    			add_location(br3, file$c, 21, 4, 973);
    			add_location(b2, file$c, 23, 4, 1056);
    			add_location(br4, file$c, 26, 4, 1293);
    			add_location(br5, file$c, 27, 4, 1304);
    			add_location(br6, file$c, 34, 4, 1579);
    			add_location(br7, file$c, 35, 4, 1590);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$c, 9, 2, 389);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$c, 40, 0, 1684);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$c, 41, 0, 1742);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$c, 45, 0, 1877);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$c, 47, 0, 1906);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$c, 48, 0, 1975);
    			attr_dev(b8, "class", "scr-b");
    			add_location(b8, file$c, 49, 0, 2036);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$c, 38, 2, 1658);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$c, 61, 4, 2380);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$c, 60, 2, 2348);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$c, 63, 2, 2461);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$c, 7, 0, 300);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteObjectBeforeEnter",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    var SCR_RouteObjectBeforeEnter$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteObjectBeforeEnter
    });

    /* docsproj/components/pages/SCR_RouteObjectAfterBeforeEnter.svelte generated by Svelte v3.37.0 */
    const file$b = "docsproj/components/pages/SCR_RouteObjectAfterBeforeEnter.svelte";

    // (128:2) <SCR_PageFooter>
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
    			add_location(div0, file$b, 129, 6, 4683);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$b, 128, 4, 4659);
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
    		source: "(128:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
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
    				$$slots: { default: [create_default_slot$a] },
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
    			add_location(h40, file$b, 6, 2, 176);
    			add_location(b0, file$b, 8, 8, 282);
    			add_location(br0, file$b, 12, 4, 562);
    			add_location(br1, file$b, 13, 4, 573);
    			add_location(br2, file$b, 17, 4, 779);
    			add_location(br3, file$b, 18, 4, 790);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$b, 7, 2, 245);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$b, 23, 0, 884);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$b, 24, 0, 942);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$b, 21, 2, 858);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$b, 29, 2, 1107);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$b, 30, 2, 1131);
    			add_location(br4, file$b, 34, 4, 1319);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$b, 31, 2, 1200);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$b, 39, 0, 1380);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$b, 37, 2, 1354);
    			add_location(b4, file$b, 46, 6, 1555);
    			add_location(br5, file$b, 48, 6, 1647);
    			add_location(b5, file$b, 52, 10, 1757);
    			add_location(b6, file$b, 56, 16, 1970);
    			add_location(li0, file$b, 56, 12, 1966);
    			add_location(b7, file$b, 57, 16, 2026);
    			add_location(li1, file$b, 57, 12, 2022);
    			add_location(b8, file$b, 59, 14, 2103);
    			add_location(li2, file$b, 58, 12, 2084);
    			add_location(b9, file$b, 63, 14, 2235);
    			add_location(li3, file$b, 62, 12, 2216);
    			add_location(b10, file$b, 67, 14, 2375);
    			add_location(li4, file$b, 66, 12, 2356);
    			add_location(b11, file$b, 71, 14, 2538);
    			add_location(li5, file$b, 70, 12, 2519);
    			add_location(b12, file$b, 74, 16, 2688);
    			add_location(li6, file$b, 74, 12, 2684);
    			add_location(b13, file$b, 75, 16, 2764);
    			add_location(li7, file$b, 75, 12, 2760);
    			add_location(ul0, file$b, 55, 10, 1949);
    			add_location(li8, file$b, 51, 8, 1742);
    			add_location(br6, file$b, 78, 8, 2864);
    			add_location(b14, file$b, 80, 10, 2894);
    			add_location(b15, file$b, 84, 16, 3103);
    			add_location(li9, file$b, 84, 12, 3099);
    			add_location(b16, file$b, 85, 16, 3159);
    			add_location(li10, file$b, 85, 12, 3155);
    			add_location(b17, file$b, 87, 14, 3236);
    			add_location(li11, file$b, 86, 12, 3217);
    			add_location(b18, file$b, 91, 14, 3368);
    			add_location(li12, file$b, 90, 12, 3349);
    			add_location(b19, file$b, 95, 14, 3508);
    			add_location(li13, file$b, 94, 12, 3489);
    			add_location(b20, file$b, 99, 14, 3671);
    			add_location(li14, file$b, 98, 12, 3652);
    			add_location(b21, file$b, 102, 16, 3821);
    			add_location(li15, file$b, 102, 12, 3817);
    			add_location(b22, file$b, 103, 16, 3897);
    			add_location(li16, file$b, 103, 12, 3893);
    			add_location(ul1, file$b, 83, 10, 3082);
    			add_location(li17, file$b, 79, 8, 2879);
    			add_location(br7, file$b, 106, 8, 3997);
    			add_location(b23, file$b, 108, 10, 4027);
    			add_location(li18, file$b, 107, 8, 4012);
    			add_location(ul2, file$b, 50, 6, 1729);
    			add_location(li19, file$b, 45, 4, 1544);
    			add_location(ul3, file$b, 44, 2, 1535);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$b, 116, 4, 4247);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$b, 115, 2, 4215);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$b, 118, 2, 4328);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$b, 5, 0, 151);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteObjectAfterBeforeEnter",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    var SCR_RouteObjectAfterBeforeEnter$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteObjectAfterBeforeEnter
    });

    /* docsproj/components/pages/SCR_RouteObjectOnError.svelte generated by Svelte v3.37.0 */
    const file$a = "docsproj/components/pages/SCR_RouteObjectOnError.svelte";

    // (19:12) <SCR_ROUTER_LINK       to={{ name: "routeComponentComponentsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$5(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Route Component Components";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$a, 22, 6, 948);
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
    		source: "(19:12) <SCR_ROUTER_LINK       to={{ name: \\\"routeComponentComponentsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (53:2) <SCR_PageFooter>
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
    			add_location(div0, file$a, 54, 6, 1898);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$a, 53, 4, 1874);
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
    		source: "(53:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
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
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_onerroranatomy = new SCR_OnErrorAnatomy({ $$inline: true });

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
    			add_location(h4, file$a, 8, 2, 307);
    			add_location(b0, file$a, 10, 8, 403);
    			add_location(br0, file$a, 12, 4, 528);
    			add_location(br1, file$a, 13, 4, 539);
    			add_location(br2, file$a, 17, 4, 779);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$a, 9, 2, 366);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$a, 28, 0, 1095);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$a, 25, 2, 1068);
    			add_location(br3, file$a, 33, 2, 1249);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$a, 36, 2, 1284);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$a, 41, 4, 1493);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$a, 40, 2, 1461);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$a, 43, 2, 1574);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$a, 7, 0, 282);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteObjectOnError",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    var SCR_RouteObjectOnError$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteObjectOnError
    });

    /* docsproj/components/pages/SCR_RouteComponentProperties.svelte generated by Svelte v3.37.0 */
    const file$9 = "docsproj/components/pages/SCR_RouteComponentProperties.svelte";

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
    			add_location(a, file$9, 18, 6, 682);
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
    function create_default_slot_1$4(ctx) {
    	let a;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "route object properties section.";
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$9, 66, 6, 2450);
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
    		source: "(63:33) <SCR_ROUTER_LINK       to={{ name: \\\"routeObjectOptionsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (177:2) <SCR_PageFooter>
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
    			add_location(div0, file$9, 178, 6, 6035);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$9, 177, 4, 6011);
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
    		source: "(177:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
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
    	let b9;
    	let t38;
    	let t39;
    	let p2;
    	let t41;
    	let hr1;
    	let t42;
    	let h42;
    	let t44;
    	let p3;
    	let t45;
    	let b10;
    	let t47;
    	let t48;
    	let pre2;
    	let b11;
    	let t50;
    	let t51;
    	let hr2;
    	let t52;
    	let h43;
    	let t54;
    	let p4;
    	let t55;
    	let b12;
    	let t57;
    	let t58;
    	let pre3;
    	let b13;
    	let t60;
    	let t61;
    	let p5;
    	let t63;
    	let center;
    	let small;
    	let t65;
    	let pre4;
    	let t67;
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
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

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
    			t32 = text("\nconst routes = [\n  {\n    name: \"routeName1\",\n    path: \"/test1\",\n\n    component: SCR_C1,\n    \n    ");
    			b7 = element("b");
    			b7.textContent = "// This property has preference over component property";
    			t34 = text("\n    lazyLoadComponent: () =>\n      import(\"./docs/pages/SCR_RouteComponentProperties.svelte\"),\n    \n    layout: SCR_Layout,\n\n    ");
    			b8 = element("b");
    			b8.textContent = "// This property has preference over layout property";
    			t36 = text("\n    lazyLoadLayoutComponent: () =>\n      import(\"./docs/SCR_Layout.svelte\"),\n\n    loadingComponent: SCR_Loading,\n\n    ");
    			b9 = element("b");
    			b9.textContent = "// This property has preference over loadingComponent property";
    			t38 = text("\n    lazyLoadLoadingComponent: () =>\n      import(\"./docs/SCR_Layout.svelte\"),\n\n    ignoreLayout: false,\n    ignoreScroll: false,\n    scrollProps: {\n      top: 0,\n      left: 0,\n      behavior: \"smooth\",\n      timeout: 10, // timeout must be greater than 10 milliseconds\n    },\n    title: \"First Route Title\",\n    params: { myCustomParam: \"text param!\", }\n    loadingProps: { textLoading: \"Loading this route...\", }\n    ignoreGlobalBeforeFunction: false,\n    executeRouteBEFBeforeGlobalBEF: false,\n    forceReload: false,\n    afterBeforeEnter: (routeObjParams) => console.log(routeObjParams)\n    beforeEnter: [\n      (resolve, routeFrom, routeTo, routeObjParams, payload) => resolve(true),\n      (resolve, routeFrom, routeTo, routeObjParams, payload) => resolve(true),\n      (resolve, routeFrom, routeTo, routeObjParams, payload) => resolve(true),\n    ],\n    onError: (err, routeObjParams) => console.error(err)\n  },\n]");
    			t39 = space();
    			p2 = element("p");
    			p2.textContent = "Each route defined inside the route array object can have these options.\n    Very robust and we can see that SCR is focused on before enter behaviour.";
    			t41 = space();
    			hr1 = element("hr");
    			t42 = space();
    			h42 = element("h4");
    			h42.textContent = "All Props";
    			t44 = space();
    			p3 = element("p");
    			t45 = text("The ");
    			b10 = element("b");
    			b10.textContent = "allProps";
    			t47 = text(" option can be passed to the router component. It must be\n    an object with all the properties that you want to deliver to every route and\n    component. This property will be made available everywhere.");
    			t48 = space();
    			pre2 = element("pre");
    			b11 = element("b");
    			b11.textContent = "// Example";
    			t50 = text("\nconst allProps = {\n  passToAll: \"OK\"\n}");
    			t51 = space();
    			hr2 = element("hr");
    			t52 = space();
    			h43 = element("h4");
    			h43.textContent = "All Loading Props";
    			t54 = space();
    			p4 = element("p");
    			t55 = text("The ");
    			b12 = element("b");
    			b12.textContent = "allLoadingProps";
    			t57 = text(" option can be passed to the router component. It must\n    be an object with all the properties that you want to deliver to every route\n    when loading the component.");
    			t58 = space();
    			pre3 = element("pre");
    			b13 = element("b");
    			b13.textContent = "// Example";
    			t60 = text("\nconst allLoadingProps = {\n  passToAll: \"OK\"\n}");
    			t61 = space();
    			p5 = element("p");
    			p5.textContent = "Now that we saw the basic properties of the component. In the next section\n    we will explore the SCR component components properties.";
    			t63 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t65 = space();
    			pre4 = element("pre");
    			pre4.textContent = "{\n  name: \"routeComponentPropertiesRoute\",\n  path: \"/svelte-client-router/routeComponentProperties\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_RouteComponentProperties.svelte\"),\n  title: \"SCR - Route Component - Properties\",\n}";
    			t67 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$9, 7, 2, 235);
    			attr_dev(a, "href", "https://svelte.dev/tutorial/basics");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$9, 9, 29, 348);
    			add_location(br0, file$9, 22, 4, 872);
    			add_location(br1, file$9, 23, 4, 883);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$9, 8, 2, 290);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$9, 30, 0, 981);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$9, 37, 0, 1368);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$9, 40, 8, 1457);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$9, 44, 0, 1517);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$9, 51, 21, 1795);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$9, 52, 28, 1922);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$9, 27, 2, 954);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$9, 56, 2, 2041);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$9, 57, 2, 2065);
    			add_location(br2, file$9, 61, 4, 2266);
    			add_location(br3, file$9, 70, 4, 2572);
    			add_location(br4, file$9, 71, 4, 2583);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$9, 58, 2, 2098);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$9, 77, 0, 2706);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$9, 85, 4, 2873);
    			attr_dev(b8, "class", "scr-b");
    			add_location(b8, file$9, 91, 4, 3082);
    			attr_dev(b9, "class", "scr-b");
    			add_location(b9, file$9, 97, 4, 3277);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$9, 74, 2, 2679);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$9, 125, 2, 4343);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$9, 129, 2, 4536);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$9, 130, 2, 4560);
    			add_location(b10, file$9, 132, 8, 4633);
    			attr_dev(p3, "class", "scr-text-justify");
    			add_location(p3, file$9, 131, 2, 4596);
    			attr_dev(b11, "class", "scr-b");
    			add_location(b11, file$9, 139, 0, 4888);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$9, 136, 2, 4861);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$9, 144, 2, 4980);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$9, 145, 2, 5004);
    			add_location(b12, file$9, 147, 8, 5085);
    			attr_dev(p4, "class", "scr-text-justify");
    			add_location(p4, file$9, 146, 2, 5048);
    			attr_dev(b13, "class", "scr-b");
    			add_location(b13, file$9, 154, 0, 5311);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$9, 151, 2, 5284);
    			attr_dev(p5, "class", "scr-text-justify");
    			add_location(p5, file$9, 159, 2, 5410);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$9, 164, 4, 5620);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$9, 163, 2, 5588);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$9, 166, 2, 5701);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$9, 6, 0, 210);
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
    			append_dev(pre1, b9);
    			append_dev(pre1, t38);
    			append_dev(div, t39);
    			append_dev(div, p2);
    			append_dev(div, t41);
    			append_dev(div, hr1);
    			append_dev(div, t42);
    			append_dev(div, h42);
    			append_dev(div, t44);
    			append_dev(div, p3);
    			append_dev(p3, t45);
    			append_dev(p3, b10);
    			append_dev(p3, t47);
    			append_dev(div, t48);
    			append_dev(div, pre2);
    			append_dev(pre2, b11);
    			append_dev(pre2, t50);
    			append_dev(div, t51);
    			append_dev(div, hr2);
    			append_dev(div, t52);
    			append_dev(div, h43);
    			append_dev(div, t54);
    			append_dev(div, p4);
    			append_dev(p4, t55);
    			append_dev(p4, b12);
    			append_dev(p4, t57);
    			append_dev(div, t58);
    			append_dev(div, pre3);
    			append_dev(pre3, b13);
    			append_dev(pre3, t60);
    			append_dev(div, t61);
    			append_dev(div, p5);
    			append_dev(div, t63);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t65);
    			append_dev(div, pre4);
    			append_dev(div, t67);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteComponentProperties",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    var SCR_RouteComponentProperties$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteComponentProperties
    });

    /* docsproj/components/pages/SCR_RouteComponentComponents.svelte generated by Svelte v3.37.0 */
    const file$8 = "docsproj/components/pages/SCR_RouteComponentComponents.svelte";

    // (150:12) <SCR_ROUTER_LINK       to={{ name: "routeObjectOptionsRoute" }}       elementProps={{ style: "display: inline; cursor: pointer;" }}     >
    function create_default_slot_1$3(ctx) {
    	let a;
    	let t0;
    	let b;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text("Route Object Properties - ");
    			b = element("b");
    			b.textContent = "Path Property";
    			add_location(b, file$8, 153, 74, 4856);
    			attr_dev(a, "href", "/");
    			set_style(a, "pointer-events", "none");
    			add_location(a, file$8, 153, 6, 4788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			append_dev(a, b);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(150:12) <SCR_ROUTER_LINK       to={{ name: \\\"routeObjectOptionsRoute\\\" }}       elementProps={{ style: \\\"display: inline; cursor: pointer;\\\" }}     >",
    		ctx
    	});

    	return block;
    }

    // (253:2) <SCR_PageFooter>
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
    			add_location(div0, file$8, 254, 6, 7709);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$8, 253, 4, 7685);
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
    		source: "(253:2) <SCR_PageFooter>",
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
    	let scr_router_link;
    	let t64;
    	let br6;
    	let t65;
    	let t66;
    	let pre4;
    	let b16;
    	let t68;
    	let b17;
    	let t70;
    	let b18;
    	let t72;
    	let b19;
    	let t74;
    	let t75;
    	let p6;
    	let t77;
    	let pre5;
    	let b20;
    	let t79;
    	let b21;
    	let t81;
    	let t82;
    	let hr3;
    	let t83;
    	let h44;
    	let t85;
    	let p7;
    	let t86;
    	let br7;
    	let t87;
    	let t88;
    	let pre6;
    	let b22;
    	let t90;
    	let b23;
    	let t92;
    	let b24;
    	let t94;
    	let b25;
    	let t96;
    	let t97;
    	let p8;
    	let t99;
    	let pre7;
    	let b26;
    	let t101;
    	let b27;
    	let t103;
    	let t104;
    	let center;
    	let small;
    	let t106;
    	let pre8;
    	let t108;
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
    			t62 = text("The Not Found Component is the component that will be loaded when the user\n    try to access a not existent route - only if there isn't any route declared with an wildcard \"*\"\n    to match all routes.\n    ");
    			br5 = element("br");
    			t63 = text("\n    See the ");
    			create_component(scr_router_link.$$.fragment);
    			t64 = text(" for more info.\n    ");
    			br6 = element("br");
    			t65 = text("\n    It will receive all the parameters available.");
    			t66 = space();
    			pre4 = element("pre");
    			b16 = element("b");
    			b16.textContent = "// Importing your components";
    			t68 = text("\nimport { SCR_ROUTER_COMPONENT } from \"svelte-client-router\"\nimport SCR_NotFound from \"../testComponents/SCR_NotFound.svelte\";\n\n");
    			b17 = element("b");
    			b17.textContent = "// Define the router object array";
    			t70 = text("\nconst routes = [\n  {\n    ... ");
    			b18 = element("b");
    			b18.textContent = "// Your routes definitions";
    			t72 = text("\n  }\n]\n\n");
    			b19 = element("b");
    			b19.textContent = "// Example of usage";
    			t74 = text("\n<SCR_ROUTER_COMPONENT \n  bind:routes \n  notFoundComponent={SCR_NotFound}\n/>");
    			t75 = space();
    			p6 = element("p");
    			p6.textContent = "Next an example of Svelte Not Found Component:";
    			t77 = space();
    			pre5 = element("pre");
    			b20 = element("b");
    			b20.textContent = "// Example of a Svelte Not Found Component";
    			t79 = text("\n<script>\n\n  ");
    			b21 = element("b");
    			b21.textContent = "// Example of route store usage";
    			t81 = text("\n  import routerStore from \"../../src/js/store/router.js\";\n\n</script>\n<center class=\"scr-center\">\n  <p class=\"scr-p\">Not Found</p>\n  <p class=\"scr-p-small\">{$routerStore.currentLocation || \"='(\"}</p>\n</center>");
    			t82 = space();
    			hr3 = element("hr");
    			t83 = space();
    			h44 = element("h4");
    			h44.textContent = "Error Component";
    			t85 = space();
    			p7 = element("p");
    			t86 = text("The Error Component is the component that must be loaded when something goes\n    wrong on routing.\n    ");
    			br7 = element("br");
    			t87 = text("\n    It will receive all the parameters available.");
    			t88 = space();
    			pre6 = element("pre");
    			b22 = element("b");
    			b22.textContent = "// Importing your components";
    			t90 = text("\nimport { SCR_ROUTER_COMPONENT } from \"svelte-client-router\"\nimport SCR_Error from \"../testComponents/SCR_Error.svelte\";\n\n");
    			b23 = element("b");
    			b23.textContent = "// Define the router object array";
    			t92 = text("\nconst routes = [\n  {\n    ... ");
    			b24 = element("b");
    			b24.textContent = "// Your routes definitions";
    			t94 = text("\n  }\n]\n\n");
    			b25 = element("b");
    			b25.textContent = "// Example of usage";
    			t96 = text("\n<SCR_ROUTER_COMPONENT \n  bind:routes \n  errorComponent={SCR_Error}\n/>");
    			t97 = space();
    			p8 = element("p");
    			p8.textContent = "Next an example of Svelte Error Component:";
    			t99 = space();
    			pre7 = element("pre");
    			b26 = element("b");
    			b26.textContent = "// Example of a Svelte Error Component";
    			t101 = text("\n<script>\n\n  ");
    			b27 = element("b");
    			b27.textContent = "// This variable was passed on onError Function";
    			t103 = text("\n  export let errorMessage = \"An error has occured!\";\n\n</script>\n\n<center class=\"scr-center\">\n  <p class=\"scr-p\">Error</p>\n  <p class=\"scr-p-small\">{errorMessage}</p>\n</center>");
    			t104 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t106 = space();
    			pre8 = element("pre");
    			pre8.textContent = "{\n  name: \"routeComponentComponentsRoute\",\n  path: \"/svelte-client-router/routeComponentComponents\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_RouteComponentComponents.svelte\"),\n  title: \"SCR - Route Component - Components\",\n}";
    			t108 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h40, "class", "scr-h4");
    			add_location(h40, file$8, 7, 2, 235);
    			add_location(br0, file$8, 12, 4, 544);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$8, 8, 2, 290);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$8, 15, 2, 604);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$8, 16, 2, 628);
    			add_location(br1, file$8, 21, 4, 881);
    			add_location(br2, file$8, 24, 4, 1015);
    			add_location(br3, file$8, 25, 4, 1026);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$8, 17, 2, 671);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$8, 31, 0, 1149);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$8, 35, 0, 1332);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$8, 38, 8, 1421);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$8, 42, 0, 1481);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$8, 28, 2, 1122);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$8, 48, 2, 1628);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$8, 51, 0, 1732);
    			attr_dev(b5, "class", "scr-b");
    			add_location(b5, file$8, 56, 2, 1903);
    			attr_dev(b6, "class", "scr-b");
    			add_location(b6, file$8, 60, 2, 2055);
    			attr_dev(b7, "class", "scr-b");
    			add_location(b7, file$8, 74, 4, 2454);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$8, 49, 2, 1706);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$8, 85, 2, 2756);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$8, 86, 2, 2780);
    			add_location(br4, file$8, 90, 4, 2967);
    			add_location(b8, file$8, 91, 20, 2994);
    			add_location(b9, file$8, 92, 4, 3051);
    			attr_dev(p3, "class", "scr-text-justify");
    			add_location(p3, file$8, 87, 2, 2824);
    			attr_dev(b10, "class", "scr-b");
    			add_location(b10, file$8, 97, 0, 3116);
    			attr_dev(b11, "class", "scr-b");
    			add_location(b11, file$8, 101, 0, 3301);
    			attr_dev(b12, "class", "scr-b");
    			add_location(b12, file$8, 104, 8, 3390);
    			attr_dev(b13, "class", "scr-b");
    			add_location(b13, file$8, 108, 0, 3450);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$8, 94, 2, 3089);
    			attr_dev(p4, "class", "scr-text-justify");
    			add_location(p4, file$8, 114, 2, 3592);
    			attr_dev(b14, "class", "scr-b");
    			add_location(b14, file$8, 117, 0, 3697);
    			attr_dev(b15, "class", "scr-b");
    			add_location(b15, file$8, 120, 2, 3777);
    			attr_dev(pre3, "class", "scr-pre");
    			add_location(pre3, file$8, 115, 2, 3671);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$8, 142, 2, 4317);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$8, 143, 2, 4341);
    			add_location(br5, file$8, 148, 4, 4625);
    			add_location(br6, file$8, 155, 4, 4923);
    			attr_dev(p5, "class", "scr-text-justify");
    			add_location(p5, file$8, 144, 2, 4387);
    			attr_dev(b16, "class", "scr-b");
    			add_location(b16, file$8, 161, 0, 5016);
    			attr_dev(b17, "class", "scr-b");
    			add_location(b17, file$8, 165, 0, 5203);
    			attr_dev(b18, "class", "scr-b");
    			add_location(b18, file$8, 168, 8, 5292);
    			attr_dev(b19, "class", "scr-b");
    			add_location(b19, file$8, 172, 0, 5352);
    			attr_dev(pre4, "class", "scr-pre");
    			add_location(pre4, file$8, 158, 2, 4989);
    			attr_dev(p6, "class", "scr-text-justify");
    			add_location(p6, file$8, 178, 2, 5496);
    			attr_dev(b20, "class", "scr-b");
    			add_location(b20, file$8, 181, 0, 5603);
    			attr_dev(b21, "class", "scr-b");
    			add_location(b21, file$8, 184, 2, 5685);
    			attr_dev(pre5, "class", "scr-pre");
    			add_location(pre5, file$8, 179, 2, 5577);
    			attr_dev(hr3, "class", "scr-hr");
    			add_location(hr3, file$8, 193, 2, 6009);
    			attr_dev(h44, "class", "scr-h4");
    			add_location(h44, file$8, 194, 2, 6033);
    			add_location(br7, file$8, 198, 4, 6211);
    			attr_dev(p7, "class", "scr-text-justify");
    			add_location(p7, file$8, 195, 2, 6075);
    			attr_dev(b22, "class", "scr-b");
    			add_location(b22, file$8, 204, 0, 6304);
    			attr_dev(b23, "class", "scr-b");
    			add_location(b23, file$8, 208, 0, 6485);
    			attr_dev(b24, "class", "scr-b");
    			add_location(b24, file$8, 211, 8, 6574);
    			attr_dev(b25, "class", "scr-b");
    			add_location(b25, file$8, 215, 0, 6634);
    			attr_dev(pre6, "class", "scr-pre");
    			add_location(pre6, file$8, 201, 2, 6277);
    			attr_dev(p8, "class", "scr-text-justify");
    			add_location(p8, file$8, 221, 2, 6772);
    			attr_dev(b26, "class", "scr-b");
    			add_location(b26, file$8, 224, 0, 6875);
    			attr_dev(b27, "class", "scr-b");
    			add_location(b27, file$8, 227, 2, 6953);
    			attr_dev(pre7, "class", "scr-pre");
    			add_location(pre7, file$8, 222, 2, 6849);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$8, 240, 4, 7294);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$8, 239, 2, 7262);
    			attr_dev(pre8, "class", "scr-pre");
    			add_location(pre8, file$8, 242, 2, 7375);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$8, 6, 0, 210);
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
    			mount_component(scr_router_link, p5, null);
    			append_dev(p5, t64);
    			append_dev(p5, br6);
    			append_dev(p5, t65);
    			append_dev(div, t66);
    			append_dev(div, pre4);
    			append_dev(pre4, b16);
    			append_dev(pre4, t68);
    			append_dev(pre4, b17);
    			append_dev(pre4, t70);
    			append_dev(pre4, b18);
    			append_dev(pre4, t72);
    			append_dev(pre4, b19);
    			append_dev(pre4, t74);
    			append_dev(div, t75);
    			append_dev(div, p6);
    			append_dev(div, t77);
    			append_dev(div, pre5);
    			append_dev(pre5, b20);
    			append_dev(pre5, t79);
    			append_dev(pre5, b21);
    			append_dev(pre5, t81);
    			append_dev(div, t82);
    			append_dev(div, hr3);
    			append_dev(div, t83);
    			append_dev(div, h44);
    			append_dev(div, t85);
    			append_dev(div, p7);
    			append_dev(p7, t86);
    			append_dev(p7, br7);
    			append_dev(p7, t87);
    			append_dev(div, t88);
    			append_dev(div, pre6);
    			append_dev(pre6, b22);
    			append_dev(pre6, t90);
    			append_dev(pre6, b23);
    			append_dev(pre6, t92);
    			append_dev(pre6, b24);
    			append_dev(pre6, t94);
    			append_dev(pre6, b25);
    			append_dev(pre6, t96);
    			append_dev(div, t97);
    			append_dev(div, p8);
    			append_dev(div, t99);
    			append_dev(div, pre7);
    			append_dev(pre7, b26);
    			append_dev(pre7, t101);
    			append_dev(pre7, b27);
    			append_dev(pre7, t103);
    			append_dev(div, t104);
    			append_dev(div, center);
    			append_dev(center, small);
    			append_dev(div, t106);
    			append_dev(div, pre8);
    			append_dev(div, t108);
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
    			transition_in(scr_pagefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scr_router_link.$$.fragment, local);
    			transition_out(scr_pagefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(scr_router_link);
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
    	validate_slots("SCR_RouteComponentComponents", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_RouteComponentComponents> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton
    	});

    	return [];
    }

    class SCR_RouteComponentComponents extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouteComponentComponents",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    var SCR_RouteComponentComponents$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouteComponentComponents
    });

    /* docsproj/components/pages/SCR_NavigationRouting.svelte generated by Svelte v3.37.0 */
    const file$7 = "docsproj/components/pages/SCR_NavigationRouting.svelte";

    // (96:2) <SCR_PageFooter>
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
    			add_location(div0, file$7, 97, 6, 2752);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$7, 96, 4, 2728);
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
    		source: "(96:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
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
    				$$slots: { default: [create_default_slot$6] },
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
    			add_location(h40, file$7, 6, 2, 176);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$7, 7, 2, 223);
    			add_location(b0, file$7, 9, 8, 315);
    			add_location(li0, file$7, 9, 4, 311);
    			add_location(b1, file$7, 11, 6, 377);
    			add_location(li1, file$7, 10, 4, 366);
    			add_location(ul0, file$7, 8, 2, 302);
    			add_location(b2, file$7, 16, 43, 556);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$7, 15, 2, 484);
    			attr_dev(hr0, "class", "scr-hr");
    			add_location(hr0, file$7, 19, 2, 627);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$7, 20, 2, 651);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$7, 23, 4, 718);
    			attr_dev(b4, "class", "scr-b");
    			add_location(b4, file$7, 28, 0, 843);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$7, 21, 2, 688);
    			attr_dev(hr1, "class", "scr-hr");
    			add_location(hr1, file$7, 35, 2, 957);
    			attr_dev(h42, "class", "scr-h4");
    			add_location(h42, file$7, 36, 2, 981);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$7, 37, 2, 1035);
    			add_location(b5, file$7, 42, 6, 1156);
    			add_location(b6, file$7, 45, 12, 1268);
    			add_location(li2, file$7, 45, 8, 1264);
    			add_location(b7, file$7, 46, 12, 1339);
    			add_location(li3, file$7, 46, 8, 1335);
    			add_location(b8, file$7, 47, 12, 1415);
    			add_location(li4, file$7, 47, 8, 1411);
    			add_location(ul1, file$7, 44, 6, 1251);
    			add_location(li5, file$7, 41, 4, 1145);
    			add_location(br0, file$7, 50, 4, 1507);
    			add_location(b9, file$7, 52, 6, 1529);
    			add_location(li6, file$7, 51, 4, 1518);
    			add_location(br1, file$7, 55, 4, 1669);
    			add_location(b10, file$7, 57, 6, 1691);
    			add_location(li7, file$7, 56, 4, 1680);
    			add_location(ul2, file$7, 40, 2, 1136);
    			attr_dev(hr2, "class", "scr-hr");
    			add_location(hr2, file$7, 62, 2, 1917);
    			attr_dev(h43, "class", "scr-h4");
    			add_location(h43, file$7, 63, 2, 1941);
    			attr_dev(b11, "class", "scr-b");
    			add_location(b11, file$7, 66, 4, 2008);
    			attr_dev(b12, "class", "scr-b");
    			add_location(b12, file$7, 71, 0, 2133);
    			attr_dev(b13, "class", "scr-b");
    			add_location(b13, file$7, 75, 2, 2195);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$7, 64, 2, 1978);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$7, 83, 4, 2366);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$7, 82, 2, 2334);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$7, 85, 2, 2447);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$7, 5, 0, 151);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_NavigationRouting",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    var SCR_NavigationRouting$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_NavigationRouting
    });

    /* docsproj/components/pages/SCR_NavigationStore.svelte generated by Svelte v3.37.0 */
    const file$6 = "docsproj/components/pages/SCR_NavigationStore.svelte";

    // (60:2) <SCR_PageFooter>
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
    			add_location(div0, file$6, 61, 6, 1616);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$6, 60, 4, 1592);
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
    		source: "(60:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
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
    				$$slots: { default: [create_default_slot$5] },
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
    			add_location(h4, file$6, 6, 2, 176);
    			add_location(br0, file$6, 13, 4, 588);
    			add_location(br1, file$6, 14, 4, 599);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$6, 7, 2, 221);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$6, 20, 4, 744);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$6, 27, 0, 881);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$6, 32, 2, 944);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$6, 37, 2, 1046);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$6, 18, 2, 714);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$6, 46, 4, 1237);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$6, 45, 2, 1205);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$6, 48, 2, 1318);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$6, 5, 0, 151);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_NavigationStore",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    var SCR_NavigationStore$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_NavigationStore
    });

    /* docsproj/components/pages/SCR_RouterLinkProperties.svelte generated by Svelte v3.37.0 */
    const file$5 = "docsproj/components/pages/SCR_RouterLinkProperties.svelte";

    // (104:2) <SCR_PageFooter>
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
    			add_location(div0, file$5, 105, 6, 3417);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$5, 104, 4, 3393);
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
    		source: "(104:2) <SCR_PageFooter>",
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
    				$$slots: { default: [create_default_slot$4] },
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
    			add_location(h40, file$5, 6, 2, 176);
    			add_location(br0, file$5, 10, 4, 376);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$5, 7, 2, 213);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$5, 15, 4, 461);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$5, 22, 0, 622);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$5, 13, 2, 431);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$5, 35, 2, 1052);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$5, 36, 2, 1076);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$5, 37, 2, 1113);
    			add_location(b2, file$5, 43, 6, 1266);
    			add_location(b3, file$5, 46, 12, 1378);
    			add_location(li0, file$5, 46, 8, 1374);
    			add_location(b4, file$5, 47, 12, 1449);
    			add_location(li1, file$5, 47, 8, 1445);
    			add_location(b5, file$5, 48, 12, 1525);
    			add_location(li2, file$5, 48, 8, 1521);
    			add_location(ul0, file$5, 45, 6, 1361);
    			add_location(li3, file$5, 42, 4, 1255);
    			add_location(br1, file$5, 51, 4, 1617);
    			add_location(b6, file$5, 53, 6, 1639);
    			add_location(li4, file$5, 52, 4, 1628);
    			add_location(br2, file$5, 56, 4, 1772);
    			add_location(b7, file$5, 58, 6, 1794);
    			add_location(li5, file$5, 57, 4, 1783);
    			add_location(br3, file$5, 62, 4, 2014);
    			add_location(b8, file$5, 64, 6, 2036);
    			add_location(li6, file$5, 63, 4, 2025);
    			add_location(ul1, file$5, 41, 2, 1246);
    			attr_dev(p2, "class", "scr-text-justify");
    			add_location(p2, file$5, 68, 2, 2179);
    			attr_dev(b9, "class", "scr-b");
    			add_location(b9, file$5, 71, 4, 2269);
    			attr_dev(b10, "class", "scr-b");
    			add_location(b10, file$5, 78, 0, 2430);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$5, 69, 2, 2239);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$5, 91, 4, 3019);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$5, 90, 2, 2987);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$5, 93, 2, 3100);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$5, 5, 0, 151);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouterLinkProperties",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    var SCR_RouterLinkProperties$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouterLinkProperties
    });

    /* docsproj/components/pages/SCR_RouterStoreProperties.svelte generated by Svelte v3.37.0 */
    const file$4 = "docsproj/components/pages/SCR_RouterStoreProperties.svelte";

    // (108:2) <SCR_PageFooter>
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
    				routeName: "routerLinkPropertiesRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right;",
    				text: "Next",
    				routeName: "testRegexPathRoute"
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
    			add_location(div0, file$4, 109, 6, 3067);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$4, 108, 4, 3043);
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
    		source: "(108:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
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
    				$$slots: { default: [create_default_slot$3] },
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
    			add_location(h40, file$4, 6, 2, 176);
    			add_location(br, file$4, 10, 4, 384);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$4, 7, 2, 214);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$4, 15, 4, 469);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$4, 21, 2, 615);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$4, 13, 2, 439);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$4, 39, 2, 1196);
    			attr_dev(h41, "class", "scr-h4");
    			add_location(h41, file$4, 40, 2, 1220);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$4, 41, 2, 1257);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$4, 42, 2, 1324);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$4, 95, 4, 2665);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$4, 94, 2, 2633);
    			attr_dev(pre2, "class", "scr-pre");
    			add_location(pre2, file$4, 97, 2, 2746);
    			attr_dev(div, "class", "scr-page");
    			add_location(div, file$4, 5, 0, 151);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_RouterStoreProperties",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    var SCR_RouterStoreProperties$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_RouterStoreProperties
    });

    /* docsproj/components/pages/SCR_TestRegexPath.svelte generated by Svelte v3.37.0 */
    const file$3 = "docsproj/components/pages/SCR_TestRegexPath.svelte";

    // (37:2) <SCR_ROUTER_LINK to={{ path: `/svelte-client-router/${nextParam}/testRegexPathParam` }}>
    function create_default_slot_1$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test Route With Param";
    			attr_dev(div, "class", "scr-btn svelte-r5my8r");
    			add_location(div, file$3, 37, 4, 1068);
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
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(37:2) <SCR_ROUTER_LINK to={{ path: `/svelte-client-router/${nextParam}/testRegexPathParam` }}>",
    		ctx
    	});

    	return block;
    }

    // (55:2) <SCR_PageFooter>
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
    				routeName: "routerStorePropertiesRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right;",
    				text: "Next",
    				routeName: "testRegexPath2Route"
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
    			add_location(div0, file$3, 56, 6, 1587);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$3, 55, 4, 1563);
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
    		source: "(55:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
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
    					path: `/svelte-client-router/${/*nextParam*/ ctx[1]}/testRegexPathParam`
    				},
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Test - Regex Path";
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
    			pre.textContent = "{\n  name: \"testRegexPathRoute\",\n  path: \"/svelte-client-router/:teste/testRegexPathParam\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_TestRegexPath.svelte\"),\n  title: \"SCR - Test 1\",\n  forceReload: true\n}";
    			t18 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$3, 16, 2, 474);
    			add_location(br0, file$3, 19, 4, 590);
    			add_location(br1, file$3, 20, 4, 601);
    			add_location(b, file$3, 21, 36, 644);
    			add_location(br2, file$3, 22, 4, 674);
    			add_location(br3, file$3, 23, 4, 685);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file$3, 17, 2, 518);
    			attr_dev(label, "for", "scr-next-param");
    			attr_dev(label, "class", "form-label");
    			add_location(label, file$3, 27, 4, 736);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control form-control-sm");
    			attr_dev(input, "id", "scr-next-param");
    			attr_dev(input, "placeholder", ":teste");
    			add_location(input, file$3, 28, 4, 807);
    			attr_dev(div0, "class", "mb-3");
    			add_location(div0, file$3, 26, 2, 713);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$3, 39, 2, 1140);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$3, 41, 4, 1196);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$3, 40, 2, 1164);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file$3, 43, 2, 1277);
    			attr_dev(div1, "class", "scr-page");
    			add_location(div1, file$3, 15, 0, 449);
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
    				path: `/svelte-client-router/${/*nextParam*/ ctx[1]}/testRegexPathParam`
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SCR_TestRegexPath", slots, []);
    	let { pathParams } = $$props;
    	let nextParam = "";
    	let regex = /[A-Za-zÀ-ú0-9]/g;
    	const writable_props = ["pathParams"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_TestRegexPath> was created with unknown prop '${key}'`);
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

    class SCR_TestRegexPath extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { pathParams: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_TestRegexPath",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pathParams*/ ctx[0] === undefined && !("pathParams" in props)) {
    			console.warn("<SCR_TestRegexPath> was created without expected prop 'pathParams'");
    		}
    	}

    	get pathParams() {
    		throw new Error("<SCR_TestRegexPath>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pathParams(value) {
    		throw new Error("<SCR_TestRegexPath>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SCR_TestRegexPath$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_TestRegexPath
    });

    /* docsproj/components/pages/SCR_TestRegexPath2.svelte generated by Svelte v3.37.0 */
    const file$2 = "docsproj/components/pages/SCR_TestRegexPath2.svelte";

    // (81:2) <SCR_ROUTER_LINK     to={{       path: `/svelte-client-router/${nextFirstParam}/testRegexPathParam2/${nextSecondParam}/`,     }}   >
    function create_default_slot_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test Route With Two Params";
    			attr_dev(div, "class", "scr-btn svelte-r5my8r");
    			add_location(div, file$2, 85, 4, 2618);
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(81:2) <SCR_ROUTER_LINK     to={{       path: `/svelte-client-router/${nextFirstParam}/testRegexPathParam2/${nextSecondParam}/`,     }}   >",
    		ctx
    	});

    	return block;
    }

    // (103:2) <SCR_PageFooter>
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
    				routeName: "testRegexPathRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right;",
    				text: "Next",
    				routeName: "testLoadingComponentWithBeforeEnterRoute"
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
    			add_location(div0, file$2, 104, 6, 3164);
    			attr_dev(div1, "class", "row");
    			add_location(div1, file$2, 103, 4, 3140);
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
    		source: "(103:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let h4;
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
    	let b2;
    	let t10;
    	let b3;
    	let t12;
    	let t13;
    	let p1;
    	let t14;
    	let b4;
    	let t15_value = /*pathParams*/ ctx[0].firstParam + "";
    	let t15;
    	let t16;
    	let br1;
    	let t17;
    	let b5;
    	let t18_value = /*pathParams*/ ctx[0].secondParam + "";
    	let t18;
    	let t19;
    	let br2;
    	let t20;
    	let br3;
    	let t21;
    	let t22;
    	let div0;
    	let label0;
    	let t24;
    	let input0;
    	let t25;
    	let div1;
    	let label1;
    	let t27;
    	let input1;
    	let t28;
    	let scr_router_link;
    	let t29;
    	let hr;
    	let t30;
    	let center;
    	let small;
    	let t32;
    	let pre1;
    	let t34;
    	let scr_pagefooter;
    	let current;
    	let mounted;
    	let dispose;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: {
    					path: `/svelte-client-router/${/*nextFirstParam*/ ctx[1]}/testRegexPathParam2/${/*nextSecondParam*/ ctx[2]}/`
    				},
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	scr_pagefooter = new SCR_PageFooter({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Test - Regex Path 2";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("This route tests two regex params path. When declaring it - to go to the\n    route - you should remember that the last part of the route is a regex. \n    ");
    			br0 = element("br");
    			t3 = text("\n    So if it is empty add a trailing slash after it");
    			t4 = space();
    			pre0 = element("pre");
    			b0 = element("b");
    			b0.textContent = "<!-- Look how the bellow button was declared -->";
    			t6 = text("\n<SCR_ROUTER_LINK\n  to={{\n    path: `/svelte-client-router/${nextFirstParam}/testRegexPathParam2/${nextSecondParam}/`,\n  }}\n>\n\n");
    			b1 = element("b");
    			b1.textContent = "<!-- It was added a trailing slash at the end -->";
    			t8 = text("\n");
    			b2 = element("b");
    			b2.textContent = "<!-- If you pass an empty value then SCR will still match this route -->";
    			t10 = text("\n");
    			b3 = element("b");
    			b3.textContent = "<!-- If not present then it will try to match a different route configuration -->";
    			t12 = text("\n<div class=\"scr-btn\">Test Route With Param</div>\n</SCR_ROUTER_LINK>");
    			t13 = space();
    			p1 = element("p");
    			t14 = text("The route first param path passed is: ");
    			b4 = element("b");
    			t15 = text(t15_value);
    			t16 = space();
    			br1 = element("br");
    			t17 = text("\n    The route second param path passed is: ");
    			b5 = element("b");
    			t18 = text(t18_value);
    			t19 = space();
    			br2 = element("br");
    			t20 = space();
    			br3 = element("br");
    			t21 = text("\n    Try it!");
    			t22 = space();
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Route First Path Param";
    			t24 = space();
    			input0 = element("input");
    			t25 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Route Second Path Param";
    			t27 = space();
    			input1 = element("input");
    			t28 = space();
    			create_component(scr_router_link.$$.fragment);
    			t29 = space();
    			hr = element("hr");
    			t30 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t32 = space();
    			pre1 = element("pre");
    			pre1.textContent = "{\n  name: \"testRegexPath2Route\",\n  path: \"/svelte-client-router/:firstParam/testRegexPathParam2/:secondParam\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_TestRegexPath2.svelte\"),\n  title: \"SCR - Test 2\",\n  forceReload: true\n}";
    			t34 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file$2, 26, 2, 673);
    			add_location(br0, file$2, 30, 4, 906);
    			attr_dev(p0, "class", "scr-text-justify");
    			add_location(p0, file$2, 27, 2, 719);
    			attr_dev(b0, "class", "scr-b");
    			add_location(b0, file$2, 35, 0, 1000);
    			attr_dev(b1, "class", "scr-b");
    			add_location(b1, file$2, 42, 0, 1248);
    			attr_dev(b2, "class", "scr-b");
    			add_location(b2, file$2, 43, 0, 1325);
    			attr_dev(b3, "class", "scr-b");
    			add_location(b3, file$2, 44, 0, 1425);
    			attr_dev(pre0, "class", "scr-pre");
    			add_location(pre0, file$2, 33, 2, 974);
    			add_location(b4, file$2, 49, 42, 1702);
    			add_location(br1, file$2, 50, 4, 1737);
    			add_location(b5, file$2, 51, 43, 1787);
    			add_location(br2, file$2, 52, 4, 1823);
    			add_location(br3, file$2, 53, 4, 1834);
    			attr_dev(p1, "class", "scr-text-justify");
    			add_location(p1, file$2, 48, 2, 1631);
    			attr_dev(label0, "for", "scr-next-first-param");
    			attr_dev(label0, "class", "form-label");
    			add_location(label0, file$2, 57, 4, 1885);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-control-sm");
    			attr_dev(input0, "id", "scr-next-first-param");
    			attr_dev(input0, "placeholder", ":firstParam");
    			add_location(input0, file$2, 60, 4, 1985);
    			attr_dev(div0, "class", "mb-3");
    			add_location(div0, file$2, 56, 2, 1862);
    			attr_dev(label1, "for", "scr-next-second-param");
    			attr_dev(label1, "class", "form-label");
    			add_location(label1, file$2, 69, 4, 2192);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control form-control-sm");
    			attr_dev(input1, "id", "scr-next-second-param");
    			attr_dev(input1, "placeholder", ":secondParam");
    			add_location(input1, file$2, 72, 4, 2294);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file$2, 68, 2, 2169);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file$2, 87, 2, 2695);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file$2, 89, 4, 2751);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file$2, 88, 2, 2719);
    			attr_dev(pre1, "class", "scr-pre");
    			add_location(pre1, file$2, 91, 2, 2832);
    			attr_dev(div2, "class", "scr-page");
    			add_location(div2, file$2, 25, 0, 648);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h4);
    			append_dev(div2, t1);
    			append_dev(div2, p0);
    			append_dev(p0, t2);
    			append_dev(p0, br0);
    			append_dev(p0, t3);
    			append_dev(div2, t4);
    			append_dev(div2, pre0);
    			append_dev(pre0, b0);
    			append_dev(pre0, t6);
    			append_dev(pre0, b1);
    			append_dev(pre0, t8);
    			append_dev(pre0, b2);
    			append_dev(pre0, t10);
    			append_dev(pre0, b3);
    			append_dev(pre0, t12);
    			append_dev(div2, t13);
    			append_dev(div2, p1);
    			append_dev(p1, t14);
    			append_dev(p1, b4);
    			append_dev(b4, t15);
    			append_dev(p1, t16);
    			append_dev(p1, br1);
    			append_dev(p1, t17);
    			append_dev(p1, b5);
    			append_dev(b5, t18);
    			append_dev(p1, t19);
    			append_dev(p1, br2);
    			append_dev(p1, t20);
    			append_dev(p1, br3);
    			append_dev(p1, t21);
    			append_dev(div2, t22);
    			append_dev(div2, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t24);
    			append_dev(div0, input0);
    			set_input_value(input0, /*nextFirstParam*/ ctx[1]);
    			append_dev(div2, t25);
    			append_dev(div2, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t27);
    			append_dev(div1, input1);
    			set_input_value(input1, /*nextSecondParam*/ ctx[2]);
    			append_dev(div2, t28);
    			mount_component(scr_router_link, div2, null);
    			append_dev(div2, t29);
    			append_dev(div2, hr);
    			append_dev(div2, t30);
    			append_dev(div2, center);
    			append_dev(center, small);
    			append_dev(div2, t32);
    			append_dev(div2, pre1);
    			append_dev(div2, t34);
    			mount_component(scr_pagefooter, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*pathParams*/ 1) && t15_value !== (t15_value = /*pathParams*/ ctx[0].firstParam + "")) set_data_dev(t15, t15_value);
    			if ((!current || dirty & /*pathParams*/ 1) && t18_value !== (t18_value = /*pathParams*/ ctx[0].secondParam + "")) set_data_dev(t18, t18_value);

    			if (dirty & /*nextFirstParam*/ 2 && input0.value !== /*nextFirstParam*/ ctx[1]) {
    				set_input_value(input0, /*nextFirstParam*/ ctx[1]);
    			}

    			if (dirty & /*nextSecondParam*/ 4 && input1.value !== /*nextSecondParam*/ ctx[2]) {
    				set_input_value(input1, /*nextSecondParam*/ ctx[2]);
    			}

    			const scr_router_link_changes = {};

    			if (dirty & /*nextFirstParam, nextSecondParam*/ 6) scr_router_link_changes.to = {
    				path: `/svelte-client-router/${/*nextFirstParam*/ ctx[1]}/testRegexPathParam2/${/*nextSecondParam*/ ctx[2]}/`
    			};

    			if (dirty & /*$$scope*/ 128) {
    				scr_router_link_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link.$set(scr_router_link_changes);
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 128) {
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
    			if (detaching) detach_dev(div2);
    			destroy_component(scr_router_link);
    			destroy_component(scr_pagefooter);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots("SCR_TestRegexPath2", slots, []);
    	let { pathParams } = $$props;
    	let nextFirstParam = "";
    	let nextSecondParam = "";
    	let regex = /[A-Za-zÀ-ú0-9]/g;

    	function applyRegex(param) {
    		const match = param.match(regex);
    		const value = match ? match.join("").substr(0, 100) + "" : "";
    		return value;
    	}

    	const writable_props = ["pathParams"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_TestRegexPath2> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		nextFirstParam = this.value;
    		$$invalidate(1, nextFirstParam);
    	}

    	function input1_input_handler() {
    		nextSecondParam = this.value;
    		$$invalidate(2, nextSecondParam);
    	}

    	$$self.$$set = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    	};

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton,
    		pathParams,
    		nextFirstParam,
    		nextSecondParam,
    		regex,
    		applyRegex
    	});

    	$$self.$inject_state = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    		if ("nextFirstParam" in $$props) $$invalidate(1, nextFirstParam = $$props.nextFirstParam);
    		if ("nextSecondParam" in $$props) $$invalidate(2, nextSecondParam = $$props.nextSecondParam);
    		if ("regex" in $$props) regex = $$props.regex;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*nextFirstParam*/ 2) {
    			if (nextFirstParam) {
    				$$invalidate(1, nextFirstParam = applyRegex(nextFirstParam));
    			}
    		}

    		if ($$self.$$.dirty & /*nextSecondParam*/ 4) {
    			if (nextSecondParam) {
    				$$invalidate(2, nextSecondParam = applyRegex(nextSecondParam));
    			}
    		}
    	};

    	return [
    		pathParams,
    		nextFirstParam,
    		nextSecondParam,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class SCR_TestRegexPath2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { pathParams: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_TestRegexPath2",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pathParams*/ ctx[0] === undefined && !("pathParams" in props)) {
    			console.warn("<SCR_TestRegexPath2> was created without expected prop 'pathParams'");
    		}
    	}

    	get pathParams() {
    		throw new Error("<SCR_TestRegexPath2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pathParams(value) {
    		throw new Error("<SCR_TestRegexPath2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SCR_TestRegexPath2$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_TestRegexPath2
    });

    /* docsproj/components/SCR_Loading.svelte generated by Svelte v3.37.0 */

    const file$1 = "docsproj/components/SCR_Loading.svelte";

    function create_fragment$1(ctx) {
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
    	let t13;
    	let h3;
    	let t14;

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
    			t12 = text(/*loadingText*/ ctx[1]);
    			t13 = space();
    			h3 = element("h3");
    			t14 = text(/*subLoadingText*/ ctx[0]);
    			attr_dev(div0, "class", "svelte-j2ovi");
    			add_location(div0, file$1, 16, 4, 440);
    			attr_dev(div1, "class", "svelte-j2ovi");
    			add_location(div1, file$1, 17, 4, 452);
    			attr_dev(div2, "class", "svelte-j2ovi");
    			add_location(div2, file$1, 18, 4, 464);
    			attr_dev(div3, "class", "svelte-j2ovi");
    			add_location(div3, file$1, 19, 4, 476);
    			attr_dev(div4, "class", "svelte-j2ovi");
    			add_location(div4, file$1, 20, 4, 488);
    			attr_dev(div5, "class", "svelte-j2ovi");
    			add_location(div5, file$1, 21, 4, 500);
    			attr_dev(div6, "class", "svelte-j2ovi");
    			add_location(div6, file$1, 22, 4, 512);
    			attr_dev(div7, "class", "svelte-j2ovi");
    			add_location(div7, file$1, 23, 4, 524);
    			attr_dev(div8, "class", "svelte-j2ovi");
    			add_location(div8, file$1, 24, 4, 536);
    			attr_dev(div9, "class", "svelte-j2ovi");
    			add_location(div9, file$1, 25, 4, 548);
    			attr_dev(div10, "class", "svelte-j2ovi");
    			add_location(div10, file$1, 26, 4, 560);
    			attr_dev(div11, "class", "svelte-j2ovi");
    			add_location(div11, file$1, 27, 4, 572);
    			attr_dev(div12, "class", "scr-lds-spinner svelte-j2ovi");
    			add_location(div12, file$1, 15, 2, 406);
    			attr_dev(h1, "class", "scr-h1 svelte-j2ovi");
    			add_location(h1, file$1, 29, 2, 591);
    			attr_dev(h3, "class", "scr-h3 svelte-j2ovi");
    			add_location(h3, file$1, 30, 2, 631);
    			attr_dev(center, "class", "scr-center svelte-j2ovi");
    			add_location(center, file$1, 14, 0, 376);
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
    			append_dev(center, t13);
    			append_dev(center, h3);
    			append_dev(h3, t14);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*loadingText*/ 2) set_data_dev(t12, /*loadingText*/ ctx[1]);
    			if (dirty & /*subLoadingText*/ 1) set_data_dev(t14, /*subLoadingText*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
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
    	validate_slots("SCR_Loading", slots, []);
    	let { loadingText = "Loading..." } = $$props;
    	let { subLoadingText = "" } = $$props;
    	let { queryParams } = $$props;
    	let regex = /[A-Za-zÀ-ú0-9]/g;

    	if (queryParams && queryParams.subLoadingText) {
    		const match = queryParams.subLoadingText.toString().match(regex);
    		const value = match ? match.join("").substr(0, 100) + "" : "";
    		subLoadingText = value;
    	}

    	const writable_props = ["loadingText", "subLoadingText", "queryParams"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("loadingText" in $$props) $$invalidate(1, loadingText = $$props.loadingText);
    		if ("subLoadingText" in $$props) $$invalidate(0, subLoadingText = $$props.subLoadingText);
    		if ("queryParams" in $$props) $$invalidate(2, queryParams = $$props.queryParams);
    	};

    	$$self.$capture_state = () => ({
    		loadingText,
    		subLoadingText,
    		queryParams,
    		regex
    	});

    	$$self.$inject_state = $$props => {
    		if ("loadingText" in $$props) $$invalidate(1, loadingText = $$props.loadingText);
    		if ("subLoadingText" in $$props) $$invalidate(0, subLoadingText = $$props.subLoadingText);
    		if ("queryParams" in $$props) $$invalidate(2, queryParams = $$props.queryParams);
    		if ("regex" in $$props) regex = $$props.regex;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [subLoadingText, loadingText, queryParams];
    }

    class SCR_Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			loadingText: 1,
    			subLoadingText: 0,
    			queryParams: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_Loading",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*queryParams*/ ctx[2] === undefined && !("queryParams" in props)) {
    			console.warn("<SCR_Loading> was created without expected prop 'queryParams'");
    		}
    	}

    	get loadingText() {
    		throw new Error("<SCR_Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadingText(value) {
    		throw new Error("<SCR_Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subLoadingText() {
    		throw new Error("<SCR_Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subLoadingText(value) {
    		throw new Error("<SCR_Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get queryParams() {
    		throw new Error("<SCR_Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set queryParams(value) {
    		throw new Error("<SCR_Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SCR_Loading$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_Loading
    });

    /* docsproj/components/pages/SCR_TestAnyRouteWildcard.svelte generated by Svelte v3.37.0 */
    const file = "docsproj/components/pages/SCR_TestAnyRouteWildcard.svelte";

    // (69:2) <SCR_ROUTER_LINK     to={{       path: `/svelte-client-router/anyRouteWildcard/${routeWildcardText}/${somePathParam}/`,     }}   >
    function create_default_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Test Route Any Route Wildcard With Param";
    			attr_dev(div, "class", "scr-btn");
    			add_location(div, file, 73, 4, 2054);
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
    		source: "(69:2) <SCR_ROUTER_LINK     to={{       path: `/svelte-client-router/anyRouteWildcard/${routeWildcardText}/${somePathParam}/`,     }}   >",
    		ctx
    	});

    	return block;
    }

    // (91:2) <SCR_PageFooter>
    function create_default_slot(ctx) {
    	let div2;
    	let div1;
    	let scr_pushroutebutton0;
    	let t;
    	let div0;
    	let scr_pushroutebutton1;
    	let current;
    	let mounted;
    	let dispose;

    	scr_pushroutebutton0 = new SCR_PushRouteButton({
    			props: {
    				style: "float:left",
    				text: "Previous",
    				routeName: "testLoadingComponentWithBeforeEnterRoute"
    			},
    			$$inline: true
    		});

    	scr_pushroutebutton1 = new SCR_PushRouteButton({
    			props: {
    				style: "float:right; opacity: 0.9; color: black !important; background-color: lightcoral !important; transition: 200ms; animation: pulseAnimation 2s infinite;",
    				text: "Next",
    				routePath: "/svelte-client-router/some_route_not_declared",
    				title: "Redirect To Not Found Route Test!"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			create_component(scr_pushroutebutton0.$$.fragment);
    			t = space();
    			div0 = element("div");
    			create_component(scr_pushroutebutton1.$$.fragment);
    			add_location(div0, file, 98, 8, 2815);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file, 92, 6, 2631);
    			attr_dev(div2, "class", "row");
    			add_location(div2, file, 91, 4, 2607);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			mount_component(scr_pushroutebutton0, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			mount_component(scr_pushroutebutton1, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
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
    			if (detaching) detach_dev(div2);
    			destroy_component(scr_pushroutebutton0);
    			destroy_component(scr_pushroutebutton1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(91:2) <SCR_PageFooter>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div2;
    	let h4;
    	let t1;
    	let p;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let b0;
    	let t5;
    	let t6;
    	let br2;
    	let t7;
    	let b1;
    	let t8_value = /*pathParams*/ ctx[0].somePathParam + "";
    	let t8;
    	let t9;
    	let br3;
    	let t10;
    	let br4;
    	let t11;
    	let t12;
    	let div0;
    	let label0;
    	let t14;
    	let input0;
    	let t15;
    	let div1;
    	let label1;
    	let t17;
    	let input1;
    	let t18;
    	let scr_router_link;
    	let t19;
    	let hr;
    	let t20;
    	let center;
    	let small;
    	let t22;
    	let pre;
    	let t24;
    	let scr_pagefooter;
    	let current;
    	let mounted;
    	let dispose;

    	scr_router_link = new SCR_ROUTER_LINK({
    			props: {
    				to: {
    					path: `/svelte-client-router/anyRouteWildcard/${/*routeWildcardText*/ ctx[2]}/${/*somePathParam*/ ctx[1]}/`
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
    			div2 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Test - Any Route Wildcard";
    			t1 = space();
    			p = element("p");
    			t2 = text("This route tests any route wildcard with regex param path.\n    ");
    			br0 = element("br");
    			t3 = space();
    			br1 = element("br");
    			t4 = text("\n    The route path for wildcard value is: ");
    			b0 = element("b");
    			t5 = text(/*routeWildcardTextSent*/ ctx[3]);
    			t6 = space();
    			br2 = element("br");
    			t7 = text("\n    The route param path passed is: ");
    			b1 = element("b");
    			t8 = text(t8_value);
    			t9 = space();
    			br3 = element("br");
    			t10 = space();
    			br4 = element("br");
    			t11 = text("\n    Try it!");
    			t12 = space();
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Route Wildcard Value";
    			t14 = space();
    			input0 = element("input");
    			t15 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Route Param";
    			t17 = space();
    			input1 = element("input");
    			t18 = space();
    			create_component(scr_router_link.$$.fragment);
    			t19 = space();
    			hr = element("hr");
    			t20 = space();
    			center = element("center");
    			small = element("small");
    			small.textContent = "The configuration for this route.";
    			t22 = space();
    			pre = element("pre");
    			pre.textContent = "{\n  name: \"testAnyWildcardRoute\",\n  path: \"/svelte-client-router/anyRouteWildcard/*/:somePathParam\",\n  lazyLoadComponent: () =>\n    import(\"./docs/pages/SCR_TestAnyRouteWildcard.svelte\"),\n  title: \"SCR - Test - Any Route Wildcard\",\n  forceReload: true\n}";
    			t24 = space();
    			create_component(scr_pagefooter.$$.fragment);
    			attr_dev(h4, "class", "scr-h4");
    			add_location(h4, file, 34, 2, 952);
    			add_location(br0, file, 37, 4, 1100);
    			add_location(br1, file, 38, 4, 1111);
    			add_location(b0, file, 39, 42, 1160);
    			add_location(br2, file, 40, 4, 1195);
    			add_location(b1, file, 41, 36, 1238);
    			add_location(br3, file, 42, 4, 1276);
    			add_location(br4, file, 43, 4, 1287);
    			attr_dev(p, "class", "scr-text-justify");
    			add_location(p, file, 35, 2, 1004);
    			attr_dev(label0, "for", "scr-route-wildcard-text");
    			attr_dev(label0, "class", "form-label");
    			add_location(label0, file, 47, 4, 1338);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-control-sm");
    			attr_dev(input0, "id", "scr-route-wildcard-text");
    			attr_dev(input0, "placeholder", "routeWildcardText");
    			add_location(input0, file, 50, 4, 1439);
    			attr_dev(div0, "class", "mb-3");
    			add_location(div0, file, 46, 2, 1315);
    			attr_dev(label1, "for", "scr-some-path-param");
    			attr_dev(label1, "class", "form-label");
    			add_location(label1, file, 59, 4, 1658);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "class", "form-control form-control-sm");
    			attr_dev(input1, "id", "scr-some-path-param");
    			attr_dev(input1, "placeholder", ":somePathParam");
    			add_location(input1, file, 60, 4, 1734);
    			attr_dev(div1, "class", "mb-3");
    			add_location(div1, file, 58, 2, 1635);
    			attr_dev(hr, "class", "scr-hr");
    			add_location(hr, file, 75, 2, 2145);
    			attr_dev(small, "class", "scr-small");
    			add_location(small, file, 77, 4, 2201);
    			attr_dev(center, "class", "scr-center");
    			add_location(center, file, 76, 2, 2169);
    			attr_dev(pre, "class", "scr-pre");
    			add_location(pre, file, 79, 2, 2282);
    			attr_dev(div2, "class", "scr-page");
    			add_location(div2, file, 33, 0, 927);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h4);
    			append_dev(div2, t1);
    			append_dev(div2, p);
    			append_dev(p, t2);
    			append_dev(p, br0);
    			append_dev(p, t3);
    			append_dev(p, br1);
    			append_dev(p, t4);
    			append_dev(p, b0);
    			append_dev(b0, t5);
    			append_dev(p, t6);
    			append_dev(p, br2);
    			append_dev(p, t7);
    			append_dev(p, b1);
    			append_dev(b1, t8);
    			append_dev(p, t9);
    			append_dev(p, br3);
    			append_dev(p, t10);
    			append_dev(p, br4);
    			append_dev(p, t11);
    			append_dev(div2, t12);
    			append_dev(div2, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t14);
    			append_dev(div0, input0);
    			set_input_value(input0, /*routeWildcardText*/ ctx[2]);
    			append_dev(div2, t15);
    			append_dev(div2, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t17);
    			append_dev(div1, input1);
    			set_input_value(input1, /*somePathParam*/ ctx[1]);
    			append_dev(div2, t18);
    			mount_component(scr_router_link, div2, null);
    			append_dev(div2, t19);
    			append_dev(div2, hr);
    			append_dev(div2, t20);
    			append_dev(div2, center);
    			append_dev(center, small);
    			append_dev(div2, t22);
    			append_dev(div2, pre);
    			append_dev(div2, t24);
    			mount_component(scr_pagefooter, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*routeWildcardTextSent*/ 8) set_data_dev(t5, /*routeWildcardTextSent*/ ctx[3]);
    			if ((!current || dirty & /*pathParams*/ 1) && t8_value !== (t8_value = /*pathParams*/ ctx[0].somePathParam + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*routeWildcardText*/ 4 && input0.value !== /*routeWildcardText*/ ctx[2]) {
    				set_input_value(input0, /*routeWildcardText*/ ctx[2]);
    			}

    			if (dirty & /*somePathParam*/ 2 && input1.value !== /*somePathParam*/ ctx[1]) {
    				set_input_value(input1, /*somePathParam*/ ctx[1]);
    			}

    			const scr_router_link_changes = {};

    			if (dirty & /*routeWildcardText, somePathParam*/ 6) scr_router_link_changes.to = {
    				path: `/svelte-client-router/anyRouteWildcard/${/*routeWildcardText*/ ctx[2]}/${/*somePathParam*/ ctx[1]}/`
    			};

    			if (dirty & /*$$scope*/ 512) {
    				scr_router_link_changes.$$scope = { dirty, ctx };
    			}

    			scr_router_link.$set(scr_router_link_changes);
    			const scr_pagefooter_changes = {};

    			if (dirty & /*$$scope*/ 512) {
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
    			if (detaching) detach_dev(div2);
    			destroy_component(scr_router_link);
    			destroy_component(scr_pagefooter);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots("SCR_TestAnyRouteWildcard", slots, []);
    	let { pathParams } = $$props;
    	let { currentRoute } = $$props;
    	let somePathParam = "";
    	let routeWildcardText = "";
    	let routeWildcardTextSent = "";
    	let regex = /[A-Za-zÀ-ú0-9]/g;
    	const writable_props = ["pathParams", "currentRoute"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SCR_TestAnyRouteWildcard> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		routeWildcardText = this.value;
    		$$invalidate(2, routeWildcardText);
    	}

    	function input1_input_handler() {
    		somePathParam = this.value;
    		(($$invalidate(1, somePathParam), $$invalidate(8, regex)), $$invalidate(2, routeWildcardText));
    	}

    	const click_handler = () => alert("This route simulates a not found route!");

    	$$self.$$set = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    		if ("currentRoute" in $$props) $$invalidate(4, currentRoute = $$props.currentRoute);
    	};

    	$$self.$capture_state = () => ({
    		SCR_ROUTER_LINK,
    		SCR_PageFooter,
    		SCR_PushRouteButton,
    		pathParams,
    		currentRoute,
    		somePathParam,
    		routeWildcardText,
    		routeWildcardTextSent,
    		regex
    	});

    	$$self.$inject_state = $$props => {
    		if ("pathParams" in $$props) $$invalidate(0, pathParams = $$props.pathParams);
    		if ("currentRoute" in $$props) $$invalidate(4, currentRoute = $$props.currentRoute);
    		if ("somePathParam" in $$props) $$invalidate(1, somePathParam = $$props.somePathParam);
    		if ("routeWildcardText" in $$props) $$invalidate(2, routeWildcardText = $$props.routeWildcardText);
    		if ("routeWildcardTextSent" in $$props) $$invalidate(3, routeWildcardTextSent = $$props.routeWildcardTextSent);
    		if ("regex" in $$props) $$invalidate(8, regex = $$props.regex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*somePathParam*/ 2) {
    			if (somePathParam) {
    				const match = somePathParam.toString().match(regex);
    				const value = match ? match.join("").substr(0, 100) + "" : "";
    				$$invalidate(1, somePathParam = value);
    			}
    		}

    		if ($$self.$$.dirty & /*routeWildcardText, somePathParam*/ 6) {
    			if (routeWildcardText) {
    				const match = somePathParam.toString().match(regex);
    				const value = match ? match.join("").substr(0, 20) + "" : "";
    				$$invalidate(1, somePathParam = value);
    			}
    		}

    		if ($$self.$$.dirty & /*currentRoute*/ 16) {
    			if (currentRoute) {
    				if (currentRoute.hash) {
    					const splitHashRoute = currentRoute.hash.split("/");
    					$$invalidate(3, routeWildcardTextSent = splitHashRoute[3]);
    				}
    			}
    		}
    	};

    	return [
    		pathParams,
    		somePathParam,
    		routeWildcardText,
    		routeWildcardTextSent,
    		currentRoute,
    		input0_input_handler,
    		input1_input_handler,
    		click_handler
    	];
    }

    class SCR_TestAnyRouteWildcard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { pathParams: 0, currentRoute: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SCR_TestAnyRouteWildcard",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pathParams*/ ctx[0] === undefined && !("pathParams" in props)) {
    			console.warn("<SCR_TestAnyRouteWildcard> was created without expected prop 'pathParams'");
    		}

    		if (/*currentRoute*/ ctx[4] === undefined && !("currentRoute" in props)) {
    			console.warn("<SCR_TestAnyRouteWildcard> was created without expected prop 'currentRoute'");
    		}
    	}

    	get pathParams() {
    		throw new Error("<SCR_TestAnyRouteWildcard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pathParams(value) {
    		throw new Error("<SCR_TestAnyRouteWildcard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentRoute() {
    		throw new Error("<SCR_TestAnyRouteWildcard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentRoute(value) {
    		throw new Error("<SCR_TestAnyRouteWildcard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SCR_TestAnyRouteWildcard$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': SCR_TestAnyRouteWildcard
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
