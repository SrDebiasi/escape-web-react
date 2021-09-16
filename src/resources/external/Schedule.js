/**
 *  Created by Debiasi
 *  08/07/2020
 */

import Resource from '../Resource.js'
import User from '../User.js'
import Info from '../Info.js'
import Timetable from '../Timetable.js'
import {required, minValue} from "vuelidate/lib/validators";
//import i18n       from '@/plugins/i18n'

export default class Schedule extends Resource {


    /**
     * @name endpoint
     *
     * @return string
     */
    static endpoint() {
        return 'schedule-external';
    }


    /**
     * @name structure
     *
     * @return object
     */
    static structure() {
        return {
            user_id: User.command('get.id'),
            timetable_id: null,
            voucher_id: null,
            name: null,
            day: new Date(),
            phone: null,
            email: null,
            quantity: 1,
            payment_value: null,
            payment_type: 1,
            confirmed: Info.command('name', {name: 'schedule-new-confirmed-default'}),
            paid: false,

            timetable: Timetable.new(),
        }
    }

    /**
     * @name validations for vuelidate
     *
     * @return object
     */
    static validations() {
        return {
            timetable_id: {required},
            name: {required},
            day: {required},
            phone: {required},
            email: {required},
            quantity: {required, minValue: minValue(1)}
        }
    }


    /**
     * @name forges
     *
     * @return object
     */
    static forges() {
        return {
            'day': ['out.isodate'],
            'timetable': ['in.@Timetable'],
        }
    }

}


