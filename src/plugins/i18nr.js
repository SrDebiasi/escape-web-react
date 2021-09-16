import i18n from '../i18n';

const t = function (value, variables = undefined) {
    let translated = i18n.t(value)
    if (variables)
        Object.keys(variables).map((item, i) =>
            translated = translated.replaceAll(`{${item}}`, variables[item])
        )
    return translated
}

export {t}