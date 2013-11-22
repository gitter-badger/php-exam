// $.mobile.changePage($("#pagequesigui"), "none");

// config data
var CURRENT_CATEGORY = 1;
var BOOKMARK = {
    CAT_0: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_0"),
    CAT_1: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_1"),
    CAT_20: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_20"),
    CAT_21: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_21"),
    CAT_22: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_22"),
    CAT_23: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_23"),
    CAT_24: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_24"),
    CAT_25: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_25"),
    CAT_26: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_26"),
    CAT_27: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_27"),
    CAT_28: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_28"),
    CAT_29: localStorage.getItem("PHPEXAM_BOOKMARK_CAT_29")
};
var BOOKMARK_ID = {
    CAT_0: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_0"),
    CAT_1: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_1"),
    CAT_20: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_20"),
    CAT_21: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_21"),
    CAT_22: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_22"),
    CAT_23: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_23"),
    CAT_24: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_24"),
    CAT_25: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_25"),
    CAT_26: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_26"),
    CAT_27: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_27"),
    CAT_28: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_28"),
    CAT_29: localStorage.getItem("PHPEXAM_BOOKMARK_ID_CAT_29")
};
var LAST_QUESTION_SEEN = localStorage.getItem("LAST_QUESTION_SEEN") || 1;

function getBookmark() {
    return BOOKMARK['CAT_'+CURRENT_CATEGORY];
}

function getBookmarkId() {
    return BOOKMARK_ID['CAT_'+CURRENT_CATEGORY];
}

function setBookmark(num, id) {
    BOOKMARK['CAT_'+CURRENT_CATEGORY] = num;
    BOOKMARK_ID['CAT_'+CURRENT_CATEGORY] = id;
    localStorage.setItem('PHPEXAM_BOOKMARK_CAT_'+CURRENT_CATEGORY, num);
    localStorage.setItem('PHPEXAM_BOOKMARK_ID_CAT_'+CURRENT_CATEGORY, id);
}

// categories
var CAT_BASIC = 0;
var CAT_WEB = 1;
var CAT_OOP = 2;
var CAT_SECURITY = 3;
var CAT_DATA = 4;
var CAT_IO = 5;
var CAT_STRINGS = 6;
var CAT_DB = 7;
var CAT_ARRAYS = 8;
var CAT_PHP4 = 9;
var CAT_BASIC_TITLE = "PHP basic questions";
var CAT_WEB_TITLE = "Web questions";
var CAT_OOP_TITLE = "OOP questions";
var CAT_SECURITY_TITLE = "Security questions";
var CAT_DATA_TITLE = "Data types questions";
var CAT_IO_TITLE = "IO questions";
var CAT_STRINGS_TITLE = "String questions";
var CAT_DB_TITLE = "Database questions";
var CAT_ARRAYS_TITLE = "Array questions";
var CAT_PHP4_TITLE = "PHP4 questions";

// modes
var MODE_ALL_MINUS_PHP4 = 0; // default, all except PHP4;
var MODE_ALL = 1; // all;
var MODE_CATEGORY = 2; // showing one category

// version
var VERSION = "PRO";

// app Object
var app = {

    numQuestions: index.length,     // all questions = Object.keys(questionsDataBase).length
    mode: MODE_ALL_MINUS_PHP4,      // by default all the questions except those of PHP4

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind any events that are required on startup. Common events are: 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('DOMContentLoaded', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        // control inclusion of PHP4 questions
/*
        $('#include-php4-option').on('change', function (e) {
            if ($(this).val() === "on") app.changeMode(indexNormalizedPHP4, MODE_ALL);
            else app.changeMode(indexNormalized, MODE_ALL_MINUS_PHP4)
        });
*/
        // control filtering of questions
        $('#choose-category-select').on('change', function (e) {
            var filter = $(this).val();

            CURRENT_CATEGORY = filter;
            if (filter == 0) app.changeMode(indexNormalized, MODE_ALL_MINUS_PHP4);
            if (filter == 1) app.changeMode(indexNormalizedPHP4, MODE_ALL);
            if (filter >= 20) {
                var indexCat = filter-20;
                app.changeMode(category[indexCat], MODE_CATEGORY);
            }
        });

        // control filtering of questions
        $('#choose-page-select').on('change', function (e) {
            var page = $(this).val();
            app.buildQuestions( ((page * 10) + 1), 0, 9 );
        });

        // build questions links
        app.buildQuestions(getBookmark());
        // set bookmark
        app.buildBookmarkQuestion();

/*
        // if we are reloading a question
        if (window.location.hash) {
            app.goToQuestion(LAST_QUESTION_SEEN);
        }
*/
        // random question
        $("#random-question").on("touchstart", function (e) {
            var questionNumber = randomFromInterval(1, (index.length -1));
            app.goToQuestion(questionNumber);
        });

        // bookmark question
        $("#bookmark-question-container").on("touchstart", function (e) {
            var bookmark = getBookmark()
            if (bookmark) {
                app.goToQuestion(bookmark);
            }
        });

        // add-remove bookmark
        $("#add-favorite").on("touchstart", function (e) {
            app.addBookmark();
        });
        $("#remove-favorite").on("touchstart", function (e) {
            app.removeBookmark();
        });

        // pagination
        $("#pagination-next").on("touchstart", function (e) {
            var itemsPerPage = 10
            var numQuestions = parseInt(app.numQuestions)
            var num = parseInt($(".question-token:first").attr("data-question-number"))
            num = ((num+itemsPerPage) > numQuestions) ? (numQuestions-1) : (num+itemsPerPage)
            app.buildQuestions( num, 0, 9 );
        });
        $("#pagination-previous").on("touchstart", function (e) {
            var itemsPerPage = 10;
            var num = parseInt($(".question-token:first").attr("data-question-number"))
            num = ((num-itemsPerPage) < 1) ? 1 : (num-itemsPerPage)
            app.buildQuestions( num, 0, 9 )
        });
    },

    setQuestionTitle: function(title, qId) {
        $('#question-toolbar-title').html(title);

        if ( qId ) {
            if ( qId == getBookmarkId() ) {
                $("#add-favorite").hide();
                $("#remove-favorite").show();
            }
            else {
                $("#remove-favorite").hide();
                $("#add-favorite").show();
            }
        }
    },

    setQuestionContent: function(content) {
        $('#question-content').html(content);
        // Syntax highlighter
        SyntaxHighlighter.highlight();
        // show content
        $('#question-content').show();
    },

    buildQuestions: function(from, stepBack, stepForward) {
        $.mobile.loading("show")

        from = from || 1;
        var html, qid, catId;
        stepBack = typeof stepBack !== "undefined" ? stepBack : 4;
        stepForward = typeof stepForward !== "undefined" ? stepForward : 5;
        var prev = ( ( from - stepBack ) > 0 ) ? (from - stepBack) : 1;
        var next = ( ( prev + stepBack + stepForward ) >= app.numQuestions ) ? app.numQuestions : ( prev + stepBack + stepForward );

        $("#questions-list").html('');
        for (var i = 1; i <= next; i++) {
            if ( i && ( i >= prev ) && ( i <= next) ) {
                qid = app.questionIdFromNumber(i);
                catId = this.isFirstElement(qid);
                html = (catId >= 0) ? '<li data-role="list-divider">'+this.getCategoryName(catId)+'</li>' : '';
                html += '<li class"question-list-element">' +
                    '<a href="#question" data-question-number="'+i+'" class="question-token">' +
                        'Question '+i+
                        (localStorage.getItem("PHPEXAM_QUESTION_"+qid) ? '<span class="ui-li-count">DONE</span>' : '') +
                    '</a>' +
                    ((qid == getBookmarkId()) ? '<a href="#" data-icon="star" data-iconpos="notext" data-inline="true" data-theme="b"></a>' : '') +
                '</li>';
                $("#questions-list").append(html).listview( "refresh" );
            }
        }

        // write loading, show and load question
        $('.question-token').on("touchstart", function (e) {
            var questionNumber = this.getAttribute('data-question-number');
            app.goToQuestion(questionNumber);
        });

        app.buildQuestionsPagination();

        $.mobile.loading("hide")
    },

    isFirstElement: function(qId) {
        for (var i = 0, l = category.length; i < l; i++) {
            if (category[i][1] == qId) return i
        }
        return -1
    },

    getCategoryName: function(cat) {
        switch (cat) {
            case 0: return CAT_BASIC_TITLE;
                    break;
            case 1: return CAT_WEB_TITLE;
                break;
            case 2: return CAT_OOP_TITLE;
                break;
            case 3: return CAT_SECURITY_TITLE;
                break;
            case 4: return CAT_DATA_TITLE;
                break;
            case 5: return CAT_IO_TITLE;
                break;
            case 6: return CAT_STRINGS_TITLE;
                break;
            case 7: return CAT_DB_TITLE;
                break;
            case 8: return CAT_ARRAYS_TITLE;
                break;
            case 9: return CAT_PHP4_TITLE;
                break;
            default: return '';
                    break;
        }
    },

    buildQuestionsPagination: function() {
        var itemsPerPage = 10;
        var numQuestions = app.numQuestions;
        var num = parseInt($(".question-token:first").attr("data-question-number"));
        var next = $("#pagination-next");
        var previous = $("#pagination-previous");

        // previous and next
        if ((num+itemsPerPage) > numQuestions) {
            next.addClass('ui-disabled')
        }
        else {
            if (next.hasClass('ui-disabled')) next.removeClass('ui-disabled')
        }
        if ((num-itemsPerPage) < 1) {
            previous.addClass('ui-disabled')
        }
        else {
            if (previous.hasClass('ui-disabled')) previous.removeClass('ui-disabled')
        }
        // grid select to choose page
        var l = Math.floor(numQuestions / 10)
        for (var i = 0; i <= l; i++) {
            $('#choose-category-select').find('li[data-option-index="'+i+'"]').show()
        }
        for (var j = l+1; j <= 25; j++) {
            $('#choose-page-select-menu').find('li[data-option-index="'+j+'"]').hide()
        }
    },

    buildBookmarkQuestion: function() {
        var bookmark = $("#bookmark-question-container");
        var bookmarkLink = $("#bookmark-question");
        if (getBookmark()) {
            if (bookmark.hasClass('ui-disabled')) bookmark.removeClass('ui-disabled');
            bookmarkLink.attr('href','#question');
            bookmarkLink.html("Bookmark: question " + getBookmark());
        }
        else {
            bookmark.addClass('ui-disabled');
            bookmarkLink.attr('href','#');
            bookmarkLink.html("Without bookmark");
        }
    },

    removeBookmark: function () {
        setBookmark(undefined, undefined)
        $("#remove-favorite").hide();
        $("#add-favorite").show();
    },

    addBookmark: function () {
        var qid = $(".question-info").attr('qid')
        var qNum = app.questionNumberFromId(qid)

        setBookmark(qNum, qid)
        $("#add-favorite").hide();
        $("#remove-favorite").show();
    },

    setLastQuestionSeen: function (qnum) {
        LAST_QUESTION_SEEN = qnum;
        localStorage.setItem('LAST_QUESTION_SEEN', qnum);
    },

    questionNumberFromId: function (id) {
        return index.indexOf(parseInt(id));
    },

    questionIndexFromId: function (id) {
        return 'q'+id;
    },

    questionIdFromNumber: function (num) {
        var index = app.questionIndexFromNumber(num);
        return app.questionIdFromIndex(index);
    },

    questionIndexFromNumber: function (num) {
        return 'q'+index[num];
    },

    questionIdFromIndex: function (index) {
        return questionsDataBase[index].id;
    },

    questionNumberFromIndex: function (index) {
        return app.questionNumberFromId(app.questionIdFromIndex(index));
    },

    answerIdFromQuestionId: function (qid) {
        if (qid) {
            var qnum = questions['q'+qid].num;
            if (qnum) {
                return 'a'+qnum;
            }
        }
        return 0;
    },

    isInArray: function(value, array) {
        return (array.indexOf(parseInt(value)) !== -1);
    },

    resolveQuestion: function () {
        var error = false;
        var qid = $(".question-info").attr('qid');
        var qindex = app.questionIndexFromId(qid);
        var answer = questionsDataBase[qindex].answer;

        $.each($('.question-answer input'), function () {
            var parent = $(this).parent().parent();
            var wrap = $(this).parent();
            // check if the answer is a "TEXT" one
            if (answer.correct[0] && (typeof answer.correct[0] == "string")) {
                $(this).addClass('noborder');
                if ( $(this).val().toUpperCase() == answer.correct[0].toUpperCase() ) {
                    if (parent.hasClass('answer-incorrect')) {
                        parent.removeClass('answer-incorrect');
                    }
                    parent.addClass('answer-correct');
                    $('#free_form_answer_text').html('Correct!');
                }
                else {
                    if (parent.hasClass('answer-correct')) {
                        parent.removeClass('answer-correct');
                    }
                    parent.addClass('answer-incorrect');
                    error = true;
                    $('#free_form_answer_text').html('Incorrect, correct answer is: '+answer.correct[0]);
                }
            }
            // answer is radio or checkbox
            else {
                if ( wrap.hasClass('checked') ) {
                    if ( app.isInArray($(this).val(), answer.correct ) ) {
                        if (parent.hasClass('answer-incorrect')) {
                            parent.removeClass('answer-incorrect');
                        }
                        parent.addClass('answer-correct');
                    }
                    else {
                        if (parent.hasClass('answer-correct')) {
                            parent.removeClass('answer-correct');
                        }
                        parent.addClass('answer-incorrect');
                        error = true;
                    }
                }
                else {
                    if ( app.isInArray($(this).val(), answer.correct ) ) {
                        if (parent.hasClass('answer-correct')) {
                            parent.removeClass('answer-correct');
                        }
                        parent.addClass('answer-incorrect');
                        error = true;
                    }
                    else {
                        if (parent.hasClass('answer-incorrect')) {
                            parent.removeClass('answer-incorrect');
                        }
                    }
                }
            }
        });
        if (!error) {
            localStorage.setItem("PHPEXAM_QUESTION_"+qid, "OK");
            $('#resolve-question').remove();
        }
    },

    goToQuestion: function (questionNumber) {
        $.mobile.loading("show")
        // set question as last seen
        app.setLastQuestionSeen(questionNumber);
        // start loading and show
        app.setQuestionTitle('Loading...');
        $('#question-content').hide();
        var title = 'Question ' + questionNumber;
        var qid = app.questionIdFromNumber(questionNumber);
        var qindex = app.questionIndexFromNumber(questionNumber);

        // show question
        var questionContent = app.buildQuestion(questionNumber);
        app.setQuestionTitle(title, qid);
        app.setQuestionContent(questionContent);
        app.buildQuestionButtons(qindex, questionNumber);
        // back button: hide question and re-write loading
        $('#question-toolbar a[data-rel="back"]').on("touchstart", function (e) {
            app.setQuestionTitle('Loading...');
            // rebuild questions list
            var qid = $(".question-info").attr('qid');
            var qNum = app.questionNumberFromId(qid);
            app.buildQuestions(qNum);
            // rebuild bookmark question
            app.buildBookmarkQuestion();
        });
        // hide loader
        $.mobile.loading("hide");
        // refresh
        //refreshPage();
    },

    buildQuestionButtons: function(qindex, qNum) {
        qNum = parseInt(qNum);
        var explanation = questionsDataBase[qindex].answer.explanation;
        var links = questionsDataBase[qindex].answer.link;
        if ( !$('#question-content #question-buttons').length ) {
/*
            $('#question-content').append('<div id="question-buttons">' +
                '<div id="question-comments" style="display:none;"></div>' +
                '<a href="#" class="whiteButton" id="resolve-question">Resolve</a>' +
                ((explanation.length) ? '<a href="#" class="whiteButton" id="show-comments">Show explanation</a>' : '') +
                ((!explanation.length && links.length) ? '<a href="#" class="whiteButton" id="show-comments">Show links</a>' : '') +
                ((qNum == 1) ? '' : '<a href="#" class="whiteButton" id="prev-question">Previous</a>') +
                ((qNum == app.numQuestions) ? '' : '<a href="#" class="whiteButton" id="next-question">Next</a>') +
                '</div>');
*/
            $('#question-content').append('<div id="question-buttons">' +
                '<div id="question-comments" style="display:none;"></div>' +
                ' <a href="#" data-role="button" data-mini="true" data-inline="true">Cancel</a>'+
                ((explanation.length) ? '<a href="#" data-role="button" data-mini="true" id="show-comments">Show explanation</a>' : '') +
                ((!explanation.length && links.length) ? '<a href="#" data-role="button" data-mini="true" id="show-comments">Show links</a>' : '') +
                '<div data-role="controlgroup" data-type="horizontal">' +
                    ((qNum == 1) ? '' : '<a href="#" data-role="button" data-icon="arrow-l" data-iconpos="left" id="prev-question">Previous</a>') +
                    '<a href="#" data-role="button" data-icon="check" data-iconpos="left" id="resolve-question">Resolve</a>' +
                    ((qNum == app.numQuestions) ? '' : '<a href="#" data-role="button" data-icon="arrow-r" data-iconpos="right" id="next-question">Next</a>') +
                '</div>' +
            '</div>');
            $('#question-content').append(app.buildHelpLink());
        }
        // button to resolve question
        $('#resolve-question').on("touchstart", function (e) {
            app.resolveQuestion();
        });

        // show comments
        $('#show-comments').on("touchstart", function (e) {
            var qid = $(".question-info").attr('qid');
            app.buildComments(qid);
            $(this).remove();
        });

        // button to previous question
        $('#prev-question').on("touchstart", function (e) {
            var q = parseInt(qNum) -1;
            app.goToQuestion(q);
        });

        // button to next question
        $('#next-question').on("touchstart", function (e) {
            var q = parseInt(qNum) +1;
            app.goToQuestion(q);
        });

        // button to hint number of answers
        $('.question-answer-note').on("touchstart", function (e) {
            app.showHint();
        });
    },

    buildComments: function (qid) {
        var layer = $('#question-comments');
        var index = app.questionIndexFromId(qid);

        // start loading and show
        layer.html('Loading...');

        // show question
        if (questionsDataBase[index].answer.link[0] && $("#help-links-container").hasClass("none")) {
            $("#help-links-container").removeClass("none");
        }
        if (questionsDataBase[index].answer.explanation[0]) {
            layer.show();
            layer.html(questionsDataBase[index].answer.explanation[0].replace('\\n', '<br />'));
        }
    },

    buildHelpLink: function () {
        var qid = $(".question-info").attr('qid');
        var index = app.questionIndexFromId(qid);
        var answer = questionsDataBase[index].answer;
        var links = answer.link;

        if (links.length > 0) {
            var html = '<ul id="help-links-container" class="individual none">';
            for (var i = 0, j = links.length; i < j; i++) {
                html += '<li><a href="#" onclick="var ref = window.open(\''+links[i]+'\', \'_system\'); return false;" class="question-help">'+links[i]+'</a></li>';
            }
            html += '</ul>';
        }
        else {
            html = '';
        }
        return html;
    },

    buildQuestion: function(qNum) {
        var index = app.questionIndexFromNumber(qNum);
        var id = app.questionIdFromIndex(index);
        var aChoose = (questionsDataBase[index].type != 3) ?
            '' :
            '<div id="question-'+id+'-answer-note" class="question-answer-note question-hint button"><span id="hintTitle">How many answers?</span><span id="hintText" class="none">Choose '+questionsDataBase[index].answer.correct.length+'</span></div>';
        return '<div id="question-{$count}">' +
                '<div id="question-'+id+'-info" class="question-info" qnum="'+qNum+'" qid="'+id+'" style="display:none;"></div>' +
                '<div id="question-'+id+'-number" class="question-number"></div>' +
                '<div id="question-'+id+'-text" class="question-text">' +
                    questionsDataBase[index].text +
            '</div>' +
                '<div id="question-'+id+'-answer" class="question-answer">' +
                    aChoose +
                    '<form id="question-'+id+'-form" onsubmit="return false;">' +
                        '<ul>' +
                            app.buildAnswers(qNum) +
                        '</ul>' +
                    '</form>' +
                '</div>' +
            '</div>';
    },

    buildAnswers: function(qNum) {
        var index = app.questionIndexFromNumber(qNum);
        var answer = questionsDataBase[index].answer;
        var id = app.questionIdFromIndex(index);
        var type = questionsDataBase[index]["type"];
        var html = ''; var pos = 1; var i;

        switch (type) {
            case 1:
                // Open question
                html += '<li class="question-answer" aid="'+id+'_1">'+
                    '<input type="text" name="answer" id="'+id+'_1"/>'+
                    '<label for="'+id+'_1" id="free_form_answer_text">&nbsp;<i>Write response</i></label>'+
                    '</li>';
                break;
            case 2:
                for (i = 0; i < answer.options.length; i++) {
                    pos = i+1;
                    // Single answer
                    html += '<li class="question-answer" aid="'+id+'_'+pos+'">'+
                            '<input type="radio" name="answer" value="'+pos+'" id="'+id+'_'+pos+'"/>'+
                            '<label for="'+id+'_'+pos+'">'+answer.options[i]+'</label>'+
                        '</li>';
                }
                break;
            case 3:
                for (i = 0; i < answer.options.length; i++) {
                    pos = i+1;
                    // Multiple answer
                    html += '<li class="question-answer" aid="'+id+'_'+pos+'">'+
                            '<input name="answer[]" type="checkbox" value="'+pos+'" id="'+id+'_'+pos+'"/>'+
                            '<label for="'+id+'_'+pos+'">'+answer.options[i]+'</label>'+
                        '</li>';
                }
                break;
            default:
                break;
        }

        return html;
    },

    showHint: function() {
        var el = $(".question-answer-note");
        if (el.hasClass("button")) {
            el.removeClass("button");
            el.find("span#hintTitle").addClass("none");
            el.find("span#hintText").removeClass("none");
        }
    },

    changeMode: function(questions, mode) {
        index = questions;
        app.numQuestions = index.length;
        app.mode = mode;

        var position = getBookmark();
        app.buildQuestions(position);
    },

    showCategory: function(categoryId) {
        app.changeMode(category[categoryId], MODE_CATEGORY);
    }
};

function refreshPage() {
    $.mobile.changePage(
        window.location.href,
        {
            allowSamePageTransition : true,
            transition              : 'none',
            showLoadMsg             : false,
            reloadPage              : true
        }
    );
};