const accentsTidy = function (s) {
    var r = s.toLowerCase().trim();
    r = r.replace(new RegExp(/\s/g), "-");
    r = r.replace(new RegExp(/[àáâãäå]/g), "a");
    r = r.replace(new RegExp(/æ/g), "ae");
    r = r.replace(new RegExp(/ç/g), "c");
    r = r.replace(new RegExp(/[èéêë]/g), "e");
    r = r.replace(new RegExp(/[ìíîï]/g), "i");
    r = r.replace(new RegExp(/ñ/g), "n");
    r = r.replace(new RegExp(/[òóôõö]/g), "o");
    r = r.replace(new RegExp(/œ/g), "oe");
    r = r.replace(new RegExp(/[ùúûü]/g), "u");
    r = r.replace(new RegExp(/[ýÿ]/g), "y");
    r = r
        .replace(new RegExp(/\W/g), "-")
        .replace(/[^\w\s-]/g, "-")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return r;
};

const createSlug = (id_nome, id_slug) => {
    txt = document.getElementById(id_nome).value;
    txt = accentsTidy(txt);
    document.getElementById(id_slug).value = txt;
};

const setSlug = (id_nome, id_slug) => {
    document.getElementById(id_nome).onchange = function () {
        createSlug(id_nome, id_slug);
    };
};
