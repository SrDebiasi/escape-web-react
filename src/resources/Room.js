/**
 *  Created by Debiasi
 *  20/07/2020
 */

import Resource from './Resource.js'
import User from './User.js'

export default class Room extends Resource {


    static SCHEDULE_TYPE_TICKET = () => (1);
    static SCHEDULE_TYPE_ROOM = () => (2);

    /**
     * @name endpoint
     *
     * @return string
     */
    static endpoint() {
        return 'room';
    }


    /**
     * @name structure
     *
     * @return object
     */
    static structure() {
        return {
            company_id: User.command('get.company').id,
            name: null,
            short_name: null,
            vacancies: 8,
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
     * @name validations
     *
     * @return object
     */
    static validations() {
        return {
            name: 'required',
            schedule_type: 'required',
            short_name: 'required',
            play_time: 'required',
            vacancies: 'required',
            ticket_price: 'required',
            room_price: 'required',
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


    // /**
    //  * @name command
    //  * @param {string} command Comando a ser executado
    //  * @param {object} options Opções para execução do comando
    //  * @return object
    //  */
    // static command (command, options = {})
    // {
    //   return options = 1;
    //   switch (command)
    //   {
    //     case 'set':
    //       Vue.set(APP_VUE.app_storage,'sessao',options.sessao);
    //
    //       hGlobal.local('set','token',APP_VUE.app_storage.sessao.token,false);
    //       hGlobal.clock(APP_VUE.app_storage.sessao.agora);
    //       break;
    //
    //     case 'get':
    //       return APP_VUE.app_storage.sessao;
    //       break;
    //
    //     case 'run.refresh':
    //       rSessao.get().then(response => { rSessao.command('set',{sessao: response.data}); });
    //       break;
    //
    //     case 'get.usuario':
    //       return rSessao.command('get').usuario;
    //       break;
    //
    //     case 'get.pessoa':
    //       return rSessao.command('get.usuario').pessoa;
    //       break;
    //
    //     case 'get.fatores':
    //       return rSessao.command('get.usuario').fatores;
    //       break;
    //
    //     case 'get.passaportes':
    //       return rSessao.command('get.usuario').passaportes;
    //       break;
    //   }
    // }
}



