/**
 *  Created by Debiasi
 *  20/07/2020
 */

import Resource   from './Resource.js'
// import {required} from "vuelidate/lib/validators";

export default class Timetable extends Resource{

  /**
   * @name endpoint
   *
   * @return string
   */
  static endpoint()
  {
    return 'timetable';
  }


  /**
   * @name structure
   *
   * @return object
   */
  static structure()
  {
    return {
      room_id: null,
      enable : true,
      start  : null,
      end    : null,
      days    : [0,1,2,3,4,5,6],
    }
  }

  /**
   * @name validations for vuelidate
   *
   * @return object
   */
  // static validations()
  // {
  //   return {
  //     room_id: {required},
  //     enable : {required},
  //     start  : {required}
  //   }
  // }

  /**
   * @name forges
   *
   * @return object
   */
  static forges()
  {
    return {
      'start': ['in.time-s'],
    }
  }

}
