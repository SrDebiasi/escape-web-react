import {t} from '../plugins/i18nr'

/**
 * capitalize first word
 * JOHN JOHN - JOHN JOHN
 * john john - John john
 */
const capitalize = (value) => {
    if (!value) return ''
    return value.toString().charAt(0).toUpperCase() + value.slice(1)
}


/**
 * capitalize first word
 * JOHN JOHN - JOHN JOHN
 * john john - John John
 */
const capitalizeAll = (value) => {
    if (!value) return ''
    let words = value.split(' ')
    let newWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1)
    })
    return newWords.join(" ")
}


/**
 * use current language to fix currency
 */
const currency = (value) => {
    if (!value) return ''
    let locale = t('currency.locale')
    let iso = t('currency.iso')
    //Use the ISO 4217 currency
    return new Intl.NumberFormat(locale, {style: 'currency', currency: iso}).format(value)
}

export  {currency, capitalize, capitalizeAll}
