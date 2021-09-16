/**
 *  Created by Debiasi
 *  20/07/2020
 */

import axios from "axios"

import store from "../plugins/store"
/*import router   from '@/routes'
*
 */
import moment from 'moment';
import {navigate} from "hookrouter";

export class Resource {

    /**
     * @name store
     *
     * @return reference
     */

    /*static store()
    { return store }*/


    /**
     * @name endpoint
     *
     * @return string
     */
    static endpoint() {
        return ''
    }


    /**
     * @name structure
     *
     * @return object
     */
    static structure() {
        return {}
    }

    /**
     * @name validations for vuelidate
     *
     * @return object
     */
    static validations() {
        return {}
    }


    /**
     * @name primary
     *
     * @return string
     */
    static primary() {
        return 'id';
    }

    /**
     * @name rules
     *
     * @return object
     */
    static rules() {
        return {}
    }


    /**
     * @name forges
     *
     * @return object
     */
    static forges() {
        return {}
    }


    /**
     * @name get
     * @param {object} options to method execution
     * @return promise
     */
    static get(options = {}) {
        return new Promise((resolve, reject) => {
            this.prepare(options);

            axios.get(this.endpoint() + (options.append ?? ''), {params: options.params})
                .then(response => {
                    this.success(options, response);
                    resolve(response);
                })
                .catch(error => {
                    this.failure(options, error);
                    reject(error);
                });
        });
    }

    /**
     * @name get
     * @param {object} options to method execution
     * @return promise
     */
    static show(options = {}) {
        return new Promise((resolve, reject) => {
            this.prepare(options);

            axios.get(this.endpoint() + '/' + options.params.id, {params: options.params})
                .then(response => {
                    this.success(options, response);
                    resolve(response);
                })
                .catch(error => {

                    this.failure(options, error);
                    reject(error);
                });
        });
    }


    /**
     * @name run
     * @param {object} options to method execution
     * @return promise
     */
    static run(options = {}) {
        return new Promise((resolve, reject) => {
            this.prepare(options);

            axios.head(this.endpoint() + options.append, {params: options.params})
                .then(response => {
                    this.success(options, response);
                    resolve(response);
                })
                .catch(response => {
                    this.failure(options, response);
                    reject(response);
                });
        });
    }


    /**
     * @name save
     * @param {object} options to method execution
     * @return promise
     */
    static save(options = {}) {
        return new Promise((resolve, reject) => {
            this.prepare(options);

            let method = 'post'
            let goto = this.endpoint() + options.append;
            if (this.is('!null', options.params.id)) {
                goto = this.endpoint() + '/' + options.params.id
                method = 'put'
            }

            axios[method](goto,
                options.params,
                {headers: {_method: 'put '}}
            )
                .then(response => {
                    this.success(options, response);
                    resolve(response);
                })
                .catch(error => {
                    this.failure(options, error);
                    reject(error);
                });


        });
    }


    /**
     * @name delete
     * @param {object} options to method execution
     * @return promise
     */
    static delete(options = {}) {
        return new Promise((resolve, reject) => {
            this.prepare(options);

            axios.delete(this.endpoint() + '/' + options.params.id,
                {params: options.params},
                {headers: {_method: 'delete '}})
                .then(response => {
                    this.success(options, response);
                    resolve(response);
                })
                .catch(response => {
                    this.failure(options, response);
                    reject(response);
                });
        });
    }


    /**
     * @name success
     * @param {object} options to method execution
     * @param {mixed} response HTTP
     * @return object
     */
    static success(options = {}, response = null) {

        //Forge In
        if (this.is('null|true', options.forgein))
            response.data = this.forge(response.data, 'in');

        // Promote
        if (this.is('true', options.promote))
            response.data = this.is('array', response.data) ? response.data[0] : response.data

        // After
        if (this.is('method', options.after))
            response.data = options.after(response.data, response)

        // Supply a parameter
        if (this.is('object', options.supply)) {
            options.supply.method(response.data)
        } else if (this.is('array', options.supply))
            this.replace(options.supply, response.data)

        // Loader
        this.disableLoader(options)

        return response;
    }

    /**
     * @name replace
     * @description replace the array, useful to save the Vue bind
     *
     * @param {array} base - base array to substitution
     * @param {array} items -
     * @return array
     */
    static replace(base, items) {
        while (base.length > 0)
            base.splice(0, 1);

        if (this.is('array', items))
            items.forEach((i) => {
                base.push(i);
            });

        return base;
    }

    /**
     * @name new
     * @param {object} options of execution
     * @return object
     */
    static new(options = {}) {
        options = this.fuse({
            base: null,
            fuse: null,
            pack: null,
            supply: null,
            inject: null
        }, options);

        // Rules
        if (this.is('null', options.base))
            options.base = this.structure();

        // Fuse
        if (this.is('object', options.fuse))
            options.base = this.fuse(options.base, options.fuse);

        // Pack
        if (this.is('object', options.pack))
            options.base = this.imitate(options.base, options.pack)

        // Supply
        options.supply = this.imitate(this.getvalue(options.supply, {}), options.base);

        // Inject
        if (this.is('array', options.inject))
            options.inject.push(options.supply);

        return options.supply;
    }

    /**
     * @name fuse
     * @description Fuse two objects
     *
     * @param {object} objectTo - Destiny Object
     * @param {object} objectFrom - Mixed Object
     * @return object
     */
    static fuse(objectTo, objectFrom) {
        return Object.assign(objectTo, objectFrom);
    }

    /**
     * @name prepare
     * @param {object} options to prepare the request
     * @return object
     */
    static prepare(options = {}) {
        // Loader
        this.enableLoader(options)

        // Append
        if (this.is('null|empty', options.append))
            options.append = '';

        // Clone
        if (this.is('null|true', options.clone))
            options.params = this.clone(options.params, options.raw || true);

        // Before
        if (this.is('method', options.before))
            options.params = options.before(options.params);

        // Forge Out
        if (this.is('!null', this.forges()))
            options.params = this.forge(options.params, 'out');

        return options;
    }

    /**
     * @name disable loader
     * @param {object} boolean or object
     * @return void
     */
    static disableLoader(options = {}) {
        // Disable the loader object
        if (this.is('object', options.loader)) {
            options.loader.method(false)
        }

        // Disable the full screen loading
        if (this.is('boolean', options.loader))
            store.dispatch({type: 'REMOVE_LOADER'})
    }

    /**
     * @name disable loader
     * @param {object} boolean or object
     * @return void
     */
    static enableLoader(options = {}) {
        // This kind of loading means true to this loader object
        if (this.is('object', options.loader)) {
            options.loader.method(true)
        }

        // This kind of loading means full screen
        if (this.is('boolean', options.loader))
            store.dispatch({type: 'ADD_LOADER'})

    }


    /**
     * @name clone
     * @description clone objects
     *
     * @param {object} property - var to be cloned
     * @param {boolean} raw - raw object
     * @param {object} target - target if necessary
     * @return *
     */
    static clone(property, raw, target = null) {
        var response = null;

        if (this.is('string|number|boolean', property))
            response = property;

        else if (this.is('object', property))
            response = this.is('true', raw) ? JSON.parse(JSON.stringify(property)) : Object.assign({}, property);
        else if (this.is('array', property))
            response = property.map(function (item) {
                return this.clone(item);
            });

        if (this.is('!null', target))
            target = response;

        return response;
    }


    /**
     * @name imitate
     * @description Merge object
     *
     * @param {object} objectTo
     * @param {object} objectFrom
     * @param {bool}   overlap - overlap values
     * @param {array}  ignore  - ignore fields
     * @return object
     */
    static imitate(objectTo = {}, objectFrom, overlap, ignore) {
        for (var key in objectFrom)
            if (this.is('null', ignore) || ignore.indexOf(key) < 0)
                objectTo[key] = this.is('null|true', overlap) ? objectFrom[key] : this.getvalue(objectTo[key], objectFrom[key]);

        return objectTo;
    }


    /**
     * @name dig
     * @description Search a value of a property by a deep reference
     *
     * @param {object} object - Object
     * @param {string} path - Path to search
     * @param {bool} optimist - Garantee that all the path will be dig
     * @return *
     */
    static dig(object, path, optimist) {
        if (path.indexOf('.') > -1) {
            var _p = path.substring(0, path.indexOf('.'));
            var _n = path.substr(path.indexOf('.') + 1);

            if (this.getvalue(optimist, false) && this.is('null|undefined', object[_p]))
                return _n.indexOf('.') > -1 ? this.dig({}, _n, true) : '';

            return this.dig(object[_p], _n);
        }

        return object ? object[path] : null;
    }


    /**
     * @name getvalue
     * @description return a value if the property is null
     *
     * @param {*} property - base
     * @param {*} defvalue - value to be returned
     * @param {*} path - if path, dig
     * @param {bool} empty - if the property is null, return a default value?
     * @return *
     */
    static getvalue(property, defvalue, path, empty) {
        if (this.is((this.is('true', empty) ? 'null|empty' : 'null'), property))
            return defvalue;

        return this.is('string', path) ? this.dig(property, path) : (this.is('method', path) ? path(property) : property);
    }


    /**
     * @name failure
     * @param {object} options - options to method execution
     * @param {mixed} response HTTP
     * @return object
     */
    static failure(options = {}, error = null) {
        console.log('failure')
        console.log(options)
        // Loader
        this.disableLoader(options)

        if (error.response.status === 401) {
            store.dispatch({type: 'RESET_STATE'})
            navigate("/login", true);
        }

        return error;
    }


    /**
     * @name forge
     * @param {array/object} data to be forged
     * @param {string} way - way forge
     * @return array/object
     */
    static forge(data, way = 'bi') {

        if (Object.keys(this.forges()).length <= 0)
            return data;

        // Method -> Apply
        var apply = (pack, target, method, way) => {
            if (method.indexOf('@') === 0) {
                let className = method.substr(1)
                var objectForge = window[className];
                pack[target] = objectForge.forge(pack[target], way);
                pack._forged = true;
            }

            switch (method) {
                case 'json':
                    pack[target] = this.is('!empty', pack[target]) ? JSON.stringify(this.clear(pack[target])) : pack[target];
                    pack._forged = true;
                    break;
                case 'float':
                    pack[target] = this.is('!empty', pack[target]) ? ((pack[target]).toString().replace(/[^[0-9]{1,2}([,.][0-9]{1,2})?$]+/g, "").replace(',', '.')) : pack[target];
                    pack._forged = true;
                    break;
                case 'time-s':
                    pack[target] = this.is('!empty', pack[target]) ? pack[target].substring(0, 5) : pack[target];
                    pack._forged = true;
                    break;
                case 'date-br':
                    pack[target] = this.is('!empty', pack[target]) ? this.moment(pack[target], 'br.date', 'iso.date') : pack[target];
                    pack._forged = true;
                    break;
                case 'date-en':
                    pack[target] = this.is('!empty', pack[target]) ? this.moment(pack[target], 'en.date', 'iso.date') : pack[target];
                    pack._forged = true;
                    break;
                case 'brdatetime':
                    pack[target] = this.is('!empty', pack[target]) ? this.moment(pack[target], 'br.datetime', 'iso.datetime') : pack[target];
                    pack._forged = true;
                    break;
                case 'brdatetime-s':
                    pack[target] = this.is('!empty', pack[target]) ? this.moment(pack[target], 'br.datetime-s', 'iso.datetime-s') : pack[target];
                    pack._forged = true;
                    break;
                case 'isodate':
                    pack[target] = this.is('!empty', pack[target]) ? this.moment(pack[target], 'iso.date', 'iso.datetime') : pack[target];
                    pack._forged = true;
                    break;
                case 'isodatetime':
                    pack[target] = this.is('!empty', pack[target]) ? this.moment(pack[target], 'iso.datetime', 'br.datetime') : pack[target];
                    pack._forged = true;
                    break;
                case 'isodatetime-s':
                    pack[target] = this.is('!empty', pack[target]) ? this.moment(pack[target], 'iso.datetime-s', 'br.datetime-s') : pack[target];
                    pack._forged = true;
                    break;
                case 'boolean':
                    pack[target] = this.is('!empty', pack[target]) ? pack[target] === true : pack[target];
                    pack._forged = true;
                    break;
                case 'lowercase':
                    pack[target] = this.is('!empty', pack[target]) ? pack[target].toLowerCase() : pack[target];
                    pack._forged = true;
                    break;
                case 'uppercase':
                    pack[target] = this.is('!empty', pack[target]) ? pack[target].toUpperCase() : pack[target];
                    pack._forged = true;
                    break;
                case 'promote':
                    pack[target] = this.is('array', pack[target]) ? (this.is('empty', pack[target]) ? null : pack[target][0]) : pack[target];
                    pack._forged = true;
                    break;
                case 'suppress':
                    delete pack[target];
                    pack._forged = true;
                    break;
                case 'sanitize':
                    pack = this.sanitize(pack);
                    pack._forged = true;
                    break;
                case 'clear':
                    pack = this.clear(pack);
                    pack._forged = true;
                    break;
                case 'build':
                    for (var field in this.structure())
                        pack[field] = this.ensure(pack, field, this.structure()[field]);
                    pack._forged = true;
                    break;
                default:
                    if (method.indexOf('@') === 0) break;

                    pack = this[method](pack, way);
                    pack._forged = true;
                    break;
            }

            return pack;
        };

        // Method -> Handle
        var handle = (pack) => {
            if (pack._forged)
                return pack;

            Object.keys(this.forges()).forEach((target) => {
                Object.defineProperty(pack, '_forged', {enumerable: false, writable: true, value: true});

                this.forges()[target].forEach((method) => {
                    if (way === 'bi' || way === method.split('.')[0])
                        pack = apply(pack, target, method.indexOf('.') > -1 ? method.split('.')[1] : method, way);
                });

                return pack;
            });

            return pack;
        }

        // Forge -> Objects
        if (this.is('object', data))
            data = handle(data);

        // Forge -> Arrays
        if (this.is('array', data))
            data.forEach(function (item) {
                return item = handle(item)
            });

        return data;
    }


    /**
     * @name transform
     * @description Realiza operações de transformação diversas
     *
     * @param {string} operations - Operações para transformação
     * @param {*} value - Valor para transformação
     * @param {object} params - Parâmetros para transformação
     * @return *
     */
    static transform(operations, value, params) {
        var response = value;
        params = this.getvalue(params, {});

        if (this.is('null|empty', value))
            return null;

        operations.split('|').forEach(function (operation) {
            switch (operation) {
                case 'to_dateformat':
                    switch (response) {
                        case 'year'               :
                            response = 'YYYY';
                            break; // 2000
                        case 'unix'               :
                            response = 'x';
                            break; // 1572145200000
                        case 'unix-ms'            :
                            response = 'X';
                            break; // 1572145200
                        case 'iso.date'           :
                            response = 'YYYY-MM-DD';
                            break; // 2000-12-31
                        case 'iso.datetime'       :
                            response = 'YYYY-MM-DD HH:mm:ss';
                            break; // 2000-12-31 01:00:00
                        case 'iso.datetime-s'     :
                            response = 'YYYY-MM-DD HH:mm';
                            break; // 2000-12-31 01:00
                        case 'en.date'            :
                            response = 'M/D/YYYY';
                            break; // 31/12/2000
                        case 'br.date'            :
                            response = 'DD/MM/YYYY';
                            break; // 31/12/2000
                        case 'br.date-y'          :
                            response = 'DD/MM';
                            break; // 31/12
                        case 'br.datetime'        :
                            response = 'DD/MM/YYYY HH:mm:ss';
                            break; // 31/12/2000 01:00:00
                        case 'br.datetime-s'      :
                            response = 'DD/MM/YYYY HH:mm';
                            break; // 31/12/2000 01:00
                        case 'br.abbr_date'       :
                            response = 'DD MMM YYYY';
                            break; // 31 Dez 2000
                        case 'br.abbr_date-y'     :
                            response = 'DD MMM';
                            break; // 31 Dez
                        case 'br.abbr_datetime'   :
                            response = 'DD MMM YYYY HH:mm:ss';
                            break; // 31 Dez 2000 01:00:00
                        case 'br.abbr_datetime-s' :
                            response = 'DD MMM YYYY HH:mm';
                            break; // 31 Dez 2000 01:00
                        case 'br.full_date'       :
                            response = 'DD [de] MMMM [de] YYYY';
                            break; // 31 de Dezembro de 2000
                        case 'br.full_date-y'     :
                            response = 'DD [de] MMMM';
                            break; // 31 de Dezembro
                        case 'br.full_datetime'   :
                            response = 'DD [de] MMMM [de] YYYY HH:mm:ss';
                            break; // 31 de Dezembro de 2000 01:00:00
                        case 'br.full_datetime-s' :
                            response = 'DD [de] MMMM [de] YYYY HH:mm';
                            break; // 31 de Dezembro de 2000 01:00
                        default :
                            response = 'DD MMM YYYY';
                            break; // 31 Dez 2000

                    }
                    break;

                case 'to_event_name':
                    response = this.is('string', response) ? response + (!this.is('null', params.action) ? ('.' + params.action) : '') : response;
                    response = this.is('object', response) ? (response._uid + '.' + response.$options._componentTag + '.' + params.action) : response;
                    break;

                case 'to_capitalized_words':
                    response = response.toLowerCase().split(' ');
                    response = response.map((w) => {
                        return w.trim();
                    });
                    response = response.map((w) => {
                        return w.length > 2 ? (w[0].toUpperCase() + w.substr(1)) : w;
                    }).join(' ');
                    break;

                case 'to_capitalized_phrase':
                    response = response.toLowerCase();
                    response = response.charAt(0).toUpperCase() + response.slice(1);
                    break;

                case 'to_clamp':
                    response = response.length > params.max ? (response.substr(0, params.max - 4) + '...') : response;
                    break;

                case 'to_only_digits':
                    response = response.replace(/\D+/g, '');
                    break;

                case 'to_float2':
                    response = parseFloat(response).toFixed(2);
                    break;

                case 'to_cnpj':
                    response = response.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1 $2 $3/$4-$5");
                    break;
                default :
                    response = '';
                    break;
            }
        });

        return response;
    }

    /**
     * @name clear
     * @description Remove all the null properties from object
     *
     * @param {object/array} target - object target
     * @return *
     */
    static clear = function (target) {
        if (this.is('object', target))
            target = [target];

        for (var i = 0; i < target.length; i++)
            for (var key in target[i])
                if (target[i][key] === null)
                    delete target[i][key];

        return target.length === 1 ? target[0] : target;
    }


    /**
     * @name is
     * @description check the value and state
     *
     * @param {value} statesIn
     * @param {value} value
     * @return *
     */
    static is(statesIn, value) {

        var response = false;
        var inverter = false;
        var states = statesIn.toString().split('|');

        for (var i = 0; i < states.length; i++) {
            var state = states[i];

            if (state.charAt(0) === '!') {
                inverter = true;
                state = state.substr(1);
            }

            switch (state) {
                case 'undefined':
                    response = typeof value === 'undefined';
                    break;
                case 'null':
                    response = value == null;
                    break;
                case 'empty':
                    //eslint-disable-next-line no-mixed-operators
                    response = this.is('null', value) || (this.is('string', value) && value.trim() === '') || this.is('array', value) && value.length === 0;
                    break;
                case 'false':
                    response = value === false;
                    break;
                case 'true':
                    response = value === true;
                    break;
                case 'guid':
                    response = this.is('string', value) && value.trim().substr(0, 3) === '=#=';
                    break;
                case 'string':
                    response = typeof value === 'string';
                    break;
                case 'date':
                    response = value instanceof Date;
                    break;
                case 'number':
                    response = typeof value === 'number';
                    break;
                case 'method':
                    response = typeof value === 'function';
                    break;
                case 'boolean':
                    response = typeof value === 'boolean';
                    break;
                case 'array':
                    response = Array.isArray(value);
                    break;
                case 'object':
                    response = this.is('!null', value) && this.is('!array', value) && typeof value === 'object';
                    break;
                case 'html':
                    response = /<[a-z][\s\S]*>/i.test(value);
                    break;
                case 'promise':
                    response = value instanceof Promise;
                    break;
                case 'nan':
                    response = isNaN(value);
                    break;
                default:
                    response = state === value;
                    break;
            }

            if (response)
                break;
        }

        return inverter ? !response : response;
    }

    /**
     * @name moment
     * @description Realiza operações a partir da biblioteca Moment.JS
     *
     * @param {string/date} date - Data a ser retornada ('now' ou data ou apenas o formato de retorno da data/hora atual)
     * @param {string} dformat - Formato de destino (se saída for formatada)
     * @param {string} oformat - Formato de origem (para conversão inicial (se diferente de ISO))
     * @return moment
     */
    static moment(date, dformat, oformat) {
        if (this.is('null|empty', date))
            return null;

        if (this.is('string', date) && date !== 'now' && !(/\d/.test(date)))
            return moment(this.clock(), this.transform('to_dateformat', date));

        date = this.is('null', date) || date === 'now' ? this.clock() : date;
        date = moment(date, this.transform('to_dateformat', this.is('null', oformat) ? 'iso.datetime' : oformat));

        return this.is('null', dformat) ? date : date.format(this.transform('to_dateformat', dformat));
    }

    /**
     * @name clock
     * @description Registra ou informa um relógio próprio interno
     *
     * @param {date / string} now - Data e hora a ser aplicada (se for o caso)
     * @param {int} interval - Intervalo de precisão (padrão: 1s)
     * @param {method} callback - Método callback
     * @return date
     */
    static clock(now, interval, callback) {
        if (!this.is('null', now)) {
            window['global_clock'] = this.is('string', now) ? new Date(now.trim().length <= 10 ? now.trim() + ' 00:00:00' : now.trim()) : now;

            clearInterval(window['_global_clock']);
            window['_global_clock'] = setInterval(() => {
                window['global_clock'] = new Date(window['global_clock'].getTime() + this.getvalue(interval, 1000));
                // eslint-disable-next-line no-unused-expressions
                callback != null ? callback(window['global_clock']) : null;
            }, this.getvalue(interval, 1000));
        }

        return this.getvalue(window['global_clock'], new Date());
    }


}

export default Resource

