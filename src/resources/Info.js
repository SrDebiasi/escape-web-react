// /**
//  *  Created by Debiasi
//  *  20/07/2020
//  */
//
// import Resource from './Resource.js'
// import {required} from "vuelidate/lib/validators";
// import User from "@/resources/User";
//
// export default class Info extends Resource {
//
//     /**
//      * @name endpoint
//      *
//      * @return string
//      */
//     static endpoint() {
//         return 'info';
//     }
//
//
//     /**
//      * @name structure
//      *
//      * @return object
//      */
//     static structure() {
//         return {
//             company_id: null,
//             name: null,
//             value: null
//         }
//     }
//
//     /**
//      * @name validations for vuelidate
//      *
//      * @return object
//      */
//     static validations() {
//         return {
//             name: {required},
//             value: {required}
//         }
//     }
//
//
//     /**
//      * @name forges
//      *
//      * @return object
//      */
//     static forges() {
//         return {
//             'value': []
//         }
//     }
//
//     /**
//      * @name command
//      * @param {string} command to be executed
//      * @param {object} options
//      * @return object
//      */
//     // eslint-disable-next-line no-unused-vars
//     static command(command, options = {}) {
//         let name = null;
//         switch (command) {
//             case 'name':
//                 name = []
//                 if (this.store().getters.info)
//                     name = this.store().getters.info.filter(f => {
//                         return f.name === options.name
//                     })
//                 return name.length > 0 ? name[0].value : 0
//
//             case 'refresh':
//                 this.get({
//                     params: {
//                         company_id: User.command('get.company').id,
//                         user_id: User.command('get').id,
//                     },
//                 }).then((response) => {
//                     this.store().commit('info', {action: 'refresh', data: response.data})
//                 })
//
//         }
//     }
//
// }
//
//
