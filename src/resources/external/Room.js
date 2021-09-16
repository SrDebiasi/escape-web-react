/**
 *  Created by Debiasi
 *  20/07/2020
 */

import Resource from '../Resource.js'
import {required} from "vuelidate/lib/validators";

export default class Room extends Resource {


    static SCHEDULE_TYPE_TICKET = () => (1);
    static SCHEDULE_TYPE_ROOM = () => (2);

    /**
     * @name endpoint
     *
     * @return string
     */
    static endpoint() {
        return 'room-external';
    }


    /**
     * @name structure
     *
     * @return object
     */
    static structure() {
        return {
            company_id: null,
            name: null,
            vacancies: null,
            enable: true,
            schedule_type: 1,
            room_price: 0,
            ticket_price: 0,
            play_time: 60,
            picture_large: null,
            picture_short: null,

            timetables: {}
        }
    }

    /**
     * @name validations for vuelidate
     *
     * @return object
     */
    static validations() {
        return {
            name: {required},
            schedule_type: {required},
            play_time: {required},
            vacancies: {required},
            ticket_price: {required},
            room_price: {required},
        }
    }


    /**
     * @name forges
     *
     * @return object
     */
    static forges() {
        return {
            'room_price': ['out.float'],
            'ticket_price': ['out.float'],
            'timetables': ['in.@Timetable'],
        }
    }


}



