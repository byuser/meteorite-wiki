/*
 * Meteorite Wiki — internationalisation (i18n) module.
 *
 * Holds every translatable UI string. English is the source language and also
 * lives directly in the HTML/JS; Russian ("ru") is provided here. Data-driven
 * content (types, glossary, …) is translated separately in data/ru.js.
 *
 * Two kinds of strings live here:
 *   - `labels`  : strings built by JavaScript at runtime (both en + ru).
 *   - `staticRu`: Russian for static page text marked with data-i18n in the
 *                 HTML. The English original is read straight from the DOM, so
 *                 only the Russian needs to be stored.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MeteoriteI18n = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var LANGS = ["en", "ru"];
  var DEFAULT = "en";

  // Strings produced by main.js while rendering (need both languages).
  var labels = {
    en: {
      viewDetails: "View details →",
      example: "Example: ",
      location: "Location: ",
      photoCredit: "Photo: Wikimedia Commons",
      atGlance: "At a glance",
      keyFacts: "Key facts",
      gallery: "More photographs",
      classRow: "Class",
      parentBody: "Parent body",
      age: "Typical age",
      exampleRow: "Example",
      relatedPrefix: "Related ",
      relatedFallback: "types",
      countOf: "of",
      typeSingular: "type",
      typePlural: "types",
      notFound:
        "Sorry, that meteorite type could not be found. ",
      browseAll: "Browse all types",
      verdictYes: "Points to a meteorite",
      verdictNo: "Rules a meteorite out",
      verdictMaybe: "Suggestive only",
      quizCorrect: "✓ Correct. ",
      quizWrong: "✗ Not quite. ",
      quizScored: "You scored",
      checkAnswers: "Check my answers",
      gradePerfect: "Perfect score — you're a meteorite expert! ☄️",
      gradeGreat: "Great work — you really know your space rocks.",
      gradeOk: "Not bad — give the other pages a read and try again.",
      gradeLow: "A tricky start — explore the wiki and have another go.",
      crumbHome: "Home",
      crumbTypes: "Types"
    },
    ru: {
      viewDetails: "Подробнее →",
      example: "Пример: ",
      location: "Местонахождение: ",
      photoCredit: "Фото: Wikimedia Commons",
      atGlance: "Кратко",
      keyFacts: "Ключевые факты",
      gallery: "Больше фотографий",
      classRow: "Класс",
      parentBody: "Родительское тело",
      age: "Типичный возраст",
      exampleRow: "Пример",
      relatedPrefix: "Похожие: ",
      relatedFallback: "типы",
      countOf: "из",
      typeSingular: "тип",
      typePlural: "типов",
      notFound:
        "К сожалению, этот тип метеорита не найден. ",
      browseAll: "Смотреть все типы",
      verdictYes: "Указывает на метеорит",
      verdictNo: "Исключает метеорит",
      verdictMaybe: "Лишь косвенный признак",
      quizCorrect: "✓ Верно. ",
      quizWrong: "✗ Не совсем. ",
      quizScored: "Ваш результат:",
      checkAnswers: "Проверить ответы",
      gradePerfect: "Отличный результат — вы знаток метеоритов! ☄️",
      gradeGreat: "Прекрасно — вы и правда разбираетесь в космических камнях.",
      gradeOk: "Неплохо — почитайте другие страницы и попробуйте снова.",
      gradeLow: "Непростое начало — изучите вики и попробуйте ещё раз.",
      crumbHome: "Главная",
      crumbTypes: "Типы"
    }
  };

  // Russian for static page text. Keys match the data-i18n attributes in HTML.
  // Values ending the key with ".html" are inserted as HTML (rich text).
  var staticRu = {
    // Shared chrome
    "brand": "☄️ Вики о метеоритах",
    "skip": "Перейти к содержимому",
    "footer":
      "Вики о метеоритах — образовательный проект. Материалы для учебных целей.",
    "nav.home": "Главная",
    "nav.types": "Типы",
    "nav.composition": "Состав",
    "nav.classification": "Классификация",
    "nav.identify": "Определить",
    "nav.famous": "Известные",
    "nav.glossary": "Глоссарий",
    "nav.quiz": "Тест",
    "nav.about": "О проекте",
    "lang.aria": "Выбор языка",

    // Home
    "home.hero.h1": "Откройте для себя мир метеоритов",
    "home.hero.p":
      "Метеориты — это осколки астероидов, Луны и Марса, которые пережили " +
      "огненное падение сквозь атмосферу Земли. Эта вики — дружелюбное " +
      "введение в то, что они собой представляют, из чего состоят и как их " +
      "различают учёные.",
    "home.hero.btn": "Смотреть типы метеоритов",
    "home.what.h2": "Что такое метеорит?",
    "home.what.p":
      "<strong>Метеороид</strong> — это небольшое каменное или металлическое " +
      "тело, движущееся в космосе. Войдя в атмосферу и раскалившись, оно " +
      "становится <strong>метеором</strong> («падающей звездой»). Любой " +
      "уцелевший кусок, достигший земли, называют " +
      "<strong>метеоритом</strong>. Изучая метеориты, мы держим в руках " +
      "частицы ранней Солнечной системы — и даже других миров.",
    "home.featured.h2": "Избранные типы",
    "home.featured.p":
      "Небольшая подборка типов, которые можно изучить в этой вики, — каждый " +
      "с настоящей фотографией. Нажмите на карточку, чтобы открыть полный " +
      'профиль, или <a href="pages/types.html">просмотрите все типы</a>.',
    "home.groups.h2": "Три основные группы",
    "home.dig.h2": "Узнать больше",
    "home.dig.identify.h3": "Это метеорит?",
    "home.dig.identify.p":
      "Нашли подозрительный камень? Пройдите по полевым тестам, которые " +
      "отличают настоящий метеорит от «метеоповода».",
    "home.dig.identify.cta": "Определить находку →",
    "home.dig.glossary.h3": "Глоссарий",
    "home.dig.glossary.p":
      "От хондр до регмаглиптов — простые определения всех терминов о " +
      "метеоритах, встречающихся на сайте.",
    "home.dig.glossary.cta": "Смотреть термины →",
    "home.dig.quiz.h3": "Пройти тест",
    "home.dig.quiz.p":
      "Думаете, что разобрались? Проверьте знания в коротком тесте с оценкой.",
    "home.dig.quiz.cta": "Начать тест →",

    // Types
    "types.h1": "Типы метеоритов",
    "types.lead":
      "Метеориты делятся на три большие группы — каменные, железные и " +
      "железокаменные, — которые далее разбиваются на конкретные типы ниже. " +
      "Воспользуйтесь поиском или фильтрами, чтобы сузить выбор, и нажмите на " +
      "любую карточку, чтобы открыть полный профиль с фотографией и " +
      "подробностями.",
    "types.groups.h2": "Три основные группы",
    "types.all.h2": "Все типы",
    "types.search.placeholder": "Поиск по типам, минералам, примерам…",
    "types.search.aria": "Поиск типов метеоритов",
    "types.filter.aria": "Фильтр по группе",
    "types.filter.all": "Все",
    "types.filter.stony": "Каменные",
    "types.filter.iron": "Железные",
    "types.filter.stonyIron": "Железокаменные",
    "types.empty": "Ни один тип метеоритов не соответствует запросу.",

    // Composition
    "comp.h1": "Состав метеоритов",
    "comp.lead":
      "Почти каждый метеорит состоит из смеси силикатных минералов и " +
      "железо-никелевого сплава. Баланс между этими двумя компонентами и " +
      "отличает каменные, железокаменные и железные метеориты. Ниже — самые " +
      "важные минералы и металлы, которые встречаются в этой вики.",
    "comp.table.h2": "Ключевые минералы и металлы",
    "comp.th.photo": "Фото",
    "comp.th.component": "Компонент",
    "comp.th.type": "Тип",
    "comp.th.desc": "Описание",
    "comp.sil.h2": "Силикаты против металла",
    "comp.sil.p":
      "<strong>Силикатные минералы</strong>, такие как оливин и пироксен, " +
      "преобладают в каменных метеоритах. <strong>Железо-никелевый " +
      "металл</strong>, состоящий из сплавов камасита и тэнита, преобладает в " +
      "железных метеоритах. Железокаменные занимают промежуточное положение — " +
      "в них примерно поровну того и другого.",
    "comp.wid.h2": "Видманштеттова структура",
    "comp.wid.p":
      "Когда железный метеорит разрезают, полируют и протравливают кислотой, " +
      "срастание камасита и тэнита проявляет уникальный перекрёстный узор — " +
      "видманштеттову структуру. Она образуется только за миллионы лет " +
      "чрезвычайно медленного остывания в недрах родительского тела, поэтому " +
      "служит надёжным признаком настоящего железного метеорита.",

    // Classification
    "class.h1": "Как классифицируют метеориты",
    "class.lead":
      "Классификация начинается с простого вопроса: сколько металла содержит " +
      "метеорит? Один этот признак распределяет каждый метеорит по одной из " +
      "трёх семей, которые затем делятся на конкретные типы со страницы «Типы».",
    "class.tree.h2": "Дерево классификации",
    "class.th.group": "Группа",
    "class.th.abundance": "Доля",
    "class.th.trait": "Определяющий признак",
    "class.row.stony.g": "Каменные",
    "class.row.stony.a": "~94% падений",
    "class.row.stony.t":
      "В основном силикатные минералы; включают хондриты и ахондриты",
    "class.row.iron.g": "Железные",
    "class.row.iron.a": "~5% падений",
    "class.row.iron.t":
      "В основном железо-никелевый металл; делятся по содержанию никеля",
    "class.row.si.g": "Железокаменные",
    "class.row.si.a": "~1% падений",
    "class.row.si.t":
      "Примерно поровну металла и силикатов; палласиты и мезосидериты",
    "class.ca.h2": "Хондриты против ахондритов",
    "class.ca.p":
      "Главное различие среди каменных метеоритов — плавились ли они. " +
      "<strong>Хондрит</strong> никогда не плавился, поэтому в нём ещё есть " +
      "хондры — крошечные шарики некогда расплавленной породы из солнечной " +
      "туманности. <strong>Ахондрит</strong> происходит из тела, которое " +
      "плавилось, что стёрло хондры и дало породу вулканического вида.",
    "class.ff.h2": "Падения против находок",
    "class.ff.p":
      "Метеориты также делят на <strong>падения</strong> (которые видели " +
      "падающими и затем подобрали) и <strong>находки</strong> (обнаруженные " +
      "позже без наблюдавшегося падения). Падения ценны для науки, ведь мы " +
      "знаем, что они недолго выветривались на поверхности Земли.",
    "class.explore.h2": "Изучите типы",

    // Identify
    "identify.h1": "Это метеорит?",
    "identify.lead":
      "Большинство камней, которые принимают за метеориты, оказываются " +
      "обычными земными породами или шлаком — их ласково называют " +
      "«метеоповодами». Ни один тест не даёт окончательного ответа, но " +
      "последовательная проверка ниже быстро отделяет перспективные находки " +
      "от остальных.",
    "identify.tests.h2": "Быстрые полевые тесты",
    "identify.expert.h2": "Если сомневаетесь — спросите специалиста",
    "identify.expert.p":
      "Если образец прошёл обнадёживающие тесты — настоящая кора плавления, " +
      "регмаглипты, необычная плотность и отсутствие пузырей, — на него стоит " +
      "взглянуть внимательнее. Геологические кафедры университетов и " +
      "естественно-научные музеи часто соглашаются осмотреть перспективный " +
      'образец, а <a href="https://www.lpi.usra.edu/meteor/" rel="noopener">' +
      "База данных Метеоритного бюллетеня</a> — авторитетный реестр " +
      "подтверждённых метеоритов. Не проводите разрушающих тестов (резку, " +
      "травление кислотой), пока образец не оценит специалист.",

    // Glossary
    "glossary.h1": "Глоссарий",
    "glossary.lead":
      "У метеоритики свой собственный словарь. Здесь — термины, которые " +
      "используются в этой вики, объяснённые простым языком.",

    // Quiz
    "quiz.h1": "Проверьте свои знания",
    "quiz.lead":
      "Небольшая самопроверка по тому, что можно узнать на этом сайте. " +
      "Выберите ответ на каждый вопрос, затем проверьте результат — к каждому " +
      "ответу прилагается короткое пояснение.",
    "quiz.noscript":
      "Для подсчёта результатов теста нужно включить JavaScript.",
    "quiz.submit": "Проверить ответы",

    // About
    "about.h1": "Об этой вики",
    "about.lead":
      "Вики о метеоритах — небольшой самостоятельный образовательный сайт, " +
      "который знакомит с основными типами метеоритов, их составом и " +
      "классификацией.",
    "about.find.h2": "Что вы здесь найдёте",
    "about.find.p":
      'Вики разбита на несколько страниц: <a href="../index.html">введение' +
      '</a>, просматриваемая галерея <a href="types.html">типов метеоритов</a>, ' +
      'разбор их <a href="composition.html">состава</a>, руководство по ' +
      '<a href="classification.html">классификации</a> и обзор некоторых ' +
      '<a href="famous.html">известных метеоритов</a>.',
    "about.built.h2": "Как это сделано",
    "about.built.p":
      "Этот сайт намеренно прост: чистый HTML, CSS и немного JavaScript, без " +
      "этапа сборки и внешних зависимостей. Всё содержание о метеоритах " +
      "хранится в одном общем файле данных, поэтому одна и та же информация " +
      "питает каждую страницу и проверяется автоматическими тестами.",
    "about.acc.h2": "Замечание о точности",
    "about.acc.p":
      "Материалы здесь изложены для обучения и не заменяют рецензируемые " +
      "источники. За авторитетными данными обращайтесь к таким организациям, " +
      "как Метеоритное общество и его База данных Метеоритного бюллетеня."
  };

  function normalize(lang) {
    return LANGS.indexOf(lang) !== -1 ? lang : DEFAULT;
  }

  function t(lang, key) {
    var dict = labels[normalize(lang)] || labels.en;
    if (key in dict) return dict[key];
    return key in labels.en ? labels.en[key] : key;
  }

  return {
    LANGS: LANGS,
    DEFAULT: DEFAULT,
    labels: labels,
    staticRu: staticRu,
    normalize: normalize,
    t: t
  };
});
