function search(tsearch) {
    if (tsearch == 'advanced') {
        var form_args = $(adv_search).serializeArray();
        qlabel_value = $('#qlabel').text();
        var qlabel = {
            "name": "qlabel",
            "value": qlabel_value
        };
        form_args.push(qlabel);
        $.blockUI({
            message: '<div class="ui segment"><div class="ui active dimmer">Loading...<div class="ui text loader"></div></div></div>',
            css: {
                border: 'none',
                '-webkit-border-radius': '40px',
                '-moz-border-radius': '40px',
                opacity: .5,
            },
        });

        $.getJSON($SCRIPT_ROOT + '/_advs_start_question',
            form_args,
            function(data) {
                search_n = data.working_nct_id_list.length;
                tag_name = 'advanced search';
                $('#search_n').html(search_n);
                $('#tag_name').html(tag_name);
                nres = parseInt(search_n);
                if (nres > 0) {
                    if (nres > 1 && nres <= 25000) {
                        $("#qfilt").show();
                        $("#qfilt_warning").hide();
                        $('#qfilt').unbind('click');
                        $('#qfilt').bind('click', function() {
                            start_question(tsearch);
                            $('#search_form_container').hide();
                            $('#question_container').show();
                            $('#results_container').show();
                            $('#search_results_container').hide();
                            $('#filter_results_container').show();
                            $("#qfilt").hide();
                            $("#qfilt_warning").hide();
                        });
                    } else {
                        if (nres > 25000) {
                            $("#qfilt").hide();
                            $("#qfilt_warning").show();
                            $('#qfilt').unbind('click');

                        }
                    }
                    find_search_results(data.working_nct_id_list, 1);
                }
            });
    } else {
        $.blockUI({
            message: '<div class="ui segment"><div class="ui active dimmer">Loading...<div class="ui text loader"></div></div></div>',
            css: {
                border: 'none',
                '-webkit-border-radius': '40px',
                '-moz-border-radius': '40px',
                opacity: .5,
            },
        });
        $.getJSON($SCRIPT_ROOT + '/_start_question', {
            stxt: $('#first_focus').val()
        }, function(data) {
            search_n = data.working_nct_id_list.length;
            tag_name = $('#first_focus').val();
            $('#search_n').html(search_n);
            $('#tag_name').html(tag_name);
            nres = parseInt(search_n);
            if (nres > 0) {
                if (nres > 1 && nres <= 25000) {
                    $("#qfilt").show();
                    $("#qfilt_warning").hide();
                    $('#qfilt').unbind('click');
                    $('#qfilt').bind('click', function() {
                        start_question(tsearch);
                        $('#search_form_container').hide();
                        $('#question_container').show();
                        $('#results_container').show();
                        $('#search_results_container').hide();
                        $('#filter_results_container').show();
                        $("#qfilt").hide();
                        $("#qfilt_warning").hide();

                    });
                } else {
                    if (nres > 25000) {
                        $("#qfilt").hide();
                        $("#qfilt_warning").show();
                        $('#qfilt').unbind('click');
                    }
                }
                find_search_results(data.working_nct_id_list, 1);
            }
        });
    }
}

// show the trial list
function result_content(nct_details_for_this_page) {

    var nct = nct_details_for_this_page;
    var sout = new String();
    for (var k in nct) { // rank
        // sout += '<tr><td class="rank">' + nct[k][1] + '</td>';
        // // title
        // sout += '<td class="title"><a href="http://clinicaltrials.gov/ct2/show/' + nct[k][0] + '" target="_blank">' + nct[k][2] + '</a>';
        // // sout += '<td class="title"><a href="http://haotianyong.appspot.com/cluster_gov?/ct2/show/' + nct[k][0] + '" target="_blank">' + nct[k][2] + '</a>';
        // // condition
        // sout += '<table class="ct_detail"><tr><td id="dtitle"> Condition: </td><td id="dvalue">' + nct[k][3] + '</td></tr></table></tr>';
        sout += '<div class="item">';
        sout += '<i class="ui large icon middle aligned">' + nct[k][1] + ' </i><div class="content">'
        sout += '<a href="http://clinicaltrials.gov/ct2/show/' + nct[k][0] + '" target="_blank" class="header">' + nct[k][2] + '</a>';
        // sout += '<div class="meta"><span>ctgov rank: <div class="">' +   + '</div></span></div>';
        sout += '<div class="description"><p> Conditions: <code>' + nct[k][3] + '</code></p></div>';
        sout += '</div></div>';
    }
    return sout
}

// start first question
function start_question(tsearch) {
    if (tsearch == 'advanced') {
        var form_args = $(adv_search).serializeArray();
        qlabel = $('#qlabel').text();
        var qlabel = {
            "name": "qlabel",
            "value": qlabel
        };
        form_args.push(qlabel);
        $
        $.blockUI({
            message: '<div class="ui segment"><div class="ui active dimmer">Loading...<div class="ui text loader"></div></div></div>',
            css: {
                border: 'none',
                '-webkit-border-radius': '40px',
                '-moz-border-radius': '40px',
                opacity: .5,
            },
        });

        $.getJSON($SCRIPT_ROOT + '/_advs_start_question',
            form_args,
            function(data) {
                search_n = data.working_nct_id_list.length;
                $('#filter_n').html(search_n);
                nres = parseInt(search_n);
                find_results(data.working_nct_id_list, 1);
                q_visualization(data.question_answer_list, data.working_nct_id_list);

            });
    } else {
        $.blockUI({
            message: '<div class="ui segment"><div class="ui active dimmer">Loading...<div class="ui text loader"></div></div></div>',
            css: {
                border: 'none',
                '-webkit-border-radius': '40px',
                '-moz-border-radius': '40px',
                opacity: .5,
            },
        });
        $.getJSON($SCRIPT_ROOT + '/_start_question', {
            stxt: $('#first_focus').val()
        }, function(data) {
            search_n = data.working_nct_id_list.length;
            $('#filter_n').html(search_n);
            nres = parseInt(search_n);
            find_results(data.working_nct_id_list, 1);
            q_visualization(data.question_answer_list, data.working_nct_id_list);


        });
    }
}

// visualize question_form
function q_visualization(question_answer_list, working_nct_id_list) {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // generate form TO BE IMPLEMENTED
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $('#question_tags').empty();
    $("#include option[value='NULL']").attr("selected", "selected");
    qa = question_answer_list[question_answer_list.length - 1]
    q = qa.question
    sout = 'Answer Question [' + question_answer_list.length.toString() + '] '
    $('#question_number').html(sout)
    if (q.entity_text != 'QNF') {
        if (q.domain.toLowerCase() == 'condition') {
            sout = '(Condition) Have you ever been diagnosed with -- ' + q.entity_text + '?'
            $('#question_title').html(sout)
        }
        if (q.domain.toLowerCase() == 'drug') {
            sout = '(Drug) Have you ever taken or received -- ' + q.entity_text + '?'
            $('#question_title').html(sout)
        }
        if (q.domain.toLowerCase() == 'procedure') {
            sout = '(Procedure) Have you ever undergone a(n) -- ' + q.entity_text + '?'
            $('#question_title').html(sout)
        }
        if (q.domain.toLowerCase() == 'measurement') {
            sout = '(Measurement) Do you know your most recent -- ' + q.entity_text + '?'
            $('#question_title').html(sout)
        }
        if (q.domain.toLowerCase() == 'observation') {
            sout = '(Observation) Do you currently have or have you ever had/been -- ' + q.entity_text + '?'
            $('#question_title').html(sout)
        }
    } else {
        sout = q.entity_text;
        $('#question_title').html(sout)
    }



    // add tag.
    for (var i = 1; i <= question_answer_list.length; i++) {
        var sout = new String();
        sout += '<div class="ui tag label button" id="qtag_' + i + '">';
        sout += '[' + i + '] ' + question_answer_list[i - 1].question.entity_text;
        sout += '</div>'
        $('#question_tags').append(sout);
        $("#qtag_" + i).unbind('click');
        $("#qtag_" + i).bind('click', { 'idx': i, 'q': question_answer_list, 'w': working_nct_id_list }, function(e) {
            var local_i = e.data.idx;
            var q = e.data.q;
            var w = e.data.w;
            if (local_i > 1) {
                d = q[local_i - 1].question.domain;
                q = q.slice(0, local_i - 1);
            } else {
                d = 'ALL';
                q = [];
            }
            for (var j = 0; j < w.length; j++) {
                if (w[j][2] >= local_i) {
                    // change status.
                    w[j][2] = 0
                }
            }
            confirm(q, w, d);
        });
    }

    // add confirm.
    $('#confirmbutton').unbind('click');
    $('#confirmbutton').bind('click', function() {
        if ($("#include").val() != 'NULL') {
            qa['answer'] = {};
            a = qa['answer'];
            a['include'] = $("#include").val();
            if ($('#include').val() == 'INC') {
                var title = $('#question_title').text();
                var patt = /^\(Measurement\).*/g;
                var result = patt.test(title);
                if(result == false){
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd
                    }
                    if (mm < 10) {
                        mm = '0' + mm
                    }
                    var today_time = mm + '/' + dd + '/' + yyyy;
                    if ($("#rangestart").attr('time_string') !== '') {
                        var rangestart = moment($("#rangestart").attr('time_string'), 'MM/DD/YYYY');
                        a['rangestart'] = -rangestart.diff(today_time, 'days');
                    }

                    if ($("#rangeend").attr('time_string') !== '') {

                        var rangeend = moment($("#rangeend").attr('time_string'), 'MM/DD/YYYY');
                        a['rangeend'] = -rangeend.diff(today_time, 'days');
                    }
                }else{
                    if ($("#measurement_value").val() != ''){
                        a['measurement_value'] = $("#measurement_value").val();
                    }
                }
            }

        }
        domain = $('#domain').val();
        confirm(question_answer_list, working_nct_id_list, domain);
        semantiUIInit();
        $('#domain').dropdown('set selected', domain);
    });
}

// event binding to confirm button
function confirm(question_answer_list, working_nct_id_list, domain) {
    formData = {
        'question_answer_list': question_answer_list,
        'working_nct_id_list': working_nct_id_list,
        'domain': domain
    };
    $.blockUI({
        message: '<div class="ui segment"><div class="ui active dimmer">Loading...<div class="ui text loader"></div></div></div>',
        css: {
            border: 'none',
            '-webkit-border-radius': '40px',
            '-moz-border-radius': '40px',
            opacity: .5,
        },
    });
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'POST',
        url: $SCRIPT_ROOT + '/_confirm',
        data: JSON.stringify(formData),
        dataType: "json",
        success: function(data) {
            console.log(data);
            $('#confirmbutton').unbind('click');
            q_visualization(data.question_answer_list, data.working_nct_id_list);
            find_results(data.working_nct_id_list, 1);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function find_search_results(working_nct_id_list, np) {
    formData = {
        'working_nct_id_list': working_nct_id_list,
        'npag': np
    }
    $.blockUI({
        message: '<div class="ui segment"><div class="ui active dimmer">Loading...<div class="ui text loader"></div></div></div>',
        css: {
            border: 'none',
            '-webkit-border-radius': '40px',
            '-moz-border-radius': '40px',
            opacity: .5,
        },
    });
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'POST',
        url: $SCRIPT_ROOT + '/_find_nct_by_page',
        async: false,
        data: JSON.stringify(formData),
        dataType: "json",
        success: function(data) { // format query
            // sout = '<p class="recap"> Left <span class="drecap">' + data.size_of_active_trials + '</span> clinical trials for: <span id="qlabel" class="drecap">' + data.q + '<span></p>';
            show_search_results(data.working_nct_id_list, data.npag, data.nct_details_for_this_page, data.size_of_active_trials);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

function show_search_results(working_nct_id_list, npag, nct_details_for_this_page) {
    size_of_active_trials = working_nct_id_list.length
    // sout = '<table id="search_table">';
    sout = result_content(nct_details_for_this_page);
    // page navigation
    // sout += '<tr><td colspan="3"><p id="nav_search">'
    np = parseInt(npag);
    sfirst = (np - 1) * 20 + 1;
    slast = np * 20;
    $('#sfirst').html(sfirst);
    $('#slast').html(slast);
    // previous
    if (np > 1) {
        $('#rprev').unbind('click');
        $('#rprev').bind('click', function() {
            find_search_results(working_nct_id_list, parseInt(npag) - 1);
            $(document).scrollTop(0);
        });
    } else {
        $('#rprev').unbind('click')
    }
    // next
    pmax = Math.ceil(parseInt(size_of_active_trials) / 20);
    if (np + 1 <= pmax) {
        $('#rnext').unbind('click');
        $('#rnext').bind('click', function() {
            find_search_results(working_nct_id_list, parseInt(npag) + 1);

            $(document).scrollTop(0);
        });
    } else {
        $('#rnext').unbind('click')
    }



    $("#search_results").html(sout);


}
// find results (similar to search)
// function to search
function find_results(working_nct_id_list, np) {
    formData = {
        'working_nct_id_list': working_nct_id_list,
        'npag': np
    }
    $.blockUI({
        message: '<div class="ui segment"><div class="ui active dimmer">Loading...<div class="ui text loader"></div></div></div>',
        css: {
            border: 'none',
            '-webkit-border-radius': '40px',
            '-moz-border-radius': '40px',
            opacity: .5,
        },
    });
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'POST',
        url: $SCRIPT_ROOT + '/_find_nct_by_page',
        data: JSON.stringify(formData),
        dataType: "json",
        success: function(data) { // format query
            // sout = '<p class="recap"> Left <span class="drecap">' + data.size_of_active_trials + '</span> clinical trials for: <span id="qlabel" class="drecap">' + data.q + '<span></p>';
            // $('#filter_header_results').html(sout)
            filter_n = data.size_of_active_trials
            $("#filter_n").html(filter_n);
            show_qfilter_results(data.working_nct_id_list, data.npag, data.nct_details_for_this_page, data.size_of_active_trials);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}


// function to output the search results
function show_qfilter_results(working_nct_id_list, npag, nct_details_for_this_page, size_of_active_trials) {
    sout = result_content(nct_details_for_this_page);
    // sout += '<tr><td colspan="3"><p id="nav_search">'
    np = parseInt(npag);
    ffirst = (np - 1) * 20 + 1;
    flast = np * 20;
    $('#ffirst').html(ffirst);
    $('#flast').html(flast);
    // previous
    if (np > 1) {
        $('#fprev').unbind('click');
        $('#fprev').bind('click', function() {
            find_results(working_nct_id_list, parseInt(npag) - 1);
            $(document).scrollTop(0);
        });
    } else {
        $('#fprev').unbind('click')
    }
    // next
    pmax = Math.ceil(parseInt(size_of_active_trials) / 20);
    if (np + 1 <= pmax) {
        $('#fnext').unbind('click');
        $('#fnext').bind('click', function() {
            find_results(working_nct_id_list, parseInt(npag) + 1);
            $(document).scrollTop(0);
        });
    } else {
        $('#fnext').unbind('click')
    }



    $("#filter_results").html(sout);
}

function semantiUIInit() {
    $('#rangeend').attr('readonly', false);
    $('#rangestart').attr('readonly', false);
    $('#rangeend').attr('time_string', '');
    $('#rangestart').attr('time_string', '');
    $('.ui.dropdown').dropdown('restore defaults');
    $('#rangestart').calendar({
        type: 'date',
        today: true,
        endCalendar: $('#rangeend'),
        onChange: function(date) {
            if (date !== undefined) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                time = month + '/' + day + '/' + year;
                $(this).attr('time_string', time);
                // everything combined
                console.log(time);
            }

        }
    });
    $('#rangeend').calendar({
        type: 'date',
        today: true,
        startCalendar: $('#rangestart'),
        onChange: function(date) {
            if (date !== undefined) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                time = month + '/' + day + '/' + year;
                $(this).attr('time_string', time);
                // everything combined
                console.log(time);
            }
        }
    });
    $('.ui.calendar').calendar('clear');
    $('#measurement_value').val('');
    $('#value_input_container').hide();
    // $('.ui.form')
    //     .form({
    //         fields: {
    //             term: 'empty'
    //         }
    //     });
    // $('.ui.form').form({
    //     fields : {
    //         term : 'empty'
    //     }
    // });
    $('.ui.search')
        .search({
            minCharacters: 3,
            showNoResults: false,
            apiSettings: {
                onResponse: function(ctResponse) {
                    var
                        response = {
                            results: []
                        };
                    // translate GitHub API response to work with search
                    $.each(ctResponse, function(index, item) {
                        var
                            maxResults = 8;
                        if (index >= maxResults) {
                            return false;
                        }
                        // create new language category

                        // add result to category
                        response.results.push({
                            title: item

                        });
                    });
                    return response;
                },
                url: 'https://cors.io/?https://clinicaltrials.gov/ct2/rpc/extend/cond?cond={query}'
            },
            onSelect: function(result) {
                $('#first_focus').val(result.title);
                $('#search_button').focus();
            }

        });

}
// document
$(document).ready(function() {
    semantiUIInit();

    $("#include").change(function() {
        var title = $('#question_title').text();
        var patt = /^\(Measurement\).*/g;
        var result = patt.test(title);
        if(result == true){
            // This is a measurement
            $('#time_container').hide();
            if ($('#include').val() == 'INC') {
                $('#value_input_container').show();
                
            } else {
                $('#value_input_container').hide();
            }
        }else{
            $('#value_input_container').hide();
            if ($('#include').val() == 'INC') {
                $('#time_container').show();
                
            } else {
                $('#time_container').hide();
            }
        }
    });

    // search
    $('#search_button').bind('click',
        function() {
            input_term = $('#first_focus').val()
            if (!input_term | input_term === '') {
                alert('Please enter a term!');
            } else {
                search("regular");
                $('#filter_results_container').hide();
                $('#question_container').hide();
                $('#results_container').show();
                $('#search_form_container').show();
                $('#search_results_container').show();
                $(document).scrollTop(0);
            }
        });



    $('#first_focus').keypress(
        function(e) {
            if (e.keyCode == 13) {
                $('.results .transition .visible').hide();
                input_term = $('#first_focus').val()
                if (!input_term | input_term === '') {
                    alert('Please enter a term!');
                } else {
                    search("regular");
                    $('#filter_results_container').hide();
                    $('#question_container').hide();
                    $('#results_container').show();
                    $('#search_form_container').show();
                    $('#search_results_container').show();
                    $(document).scrollTop(0);
                }
                return false
            }
        });

    // advanced search
    $('#advsearch_button').click(function() {
        var input = $('#search_text').val();
        $('#search_form_container').hide();
        $('#question_container').hide();
        $('#results_container').hide();
        $('#search_results_container').hide();
        $('#filter_results_container').hide();
        $('#adv_search_container').show();

    });

    $('#search_advs').click(function() {
        search("advanced");
        $('#adv_search_container').hide();
        $('#search_form_container').show();
        $('#question_container').hide();
        $('#results_container').show();
        $('#search_results_container').show();
        $('#filter_results_container').hide();
        $(document).scrollTop(0);
    });

    $('#search_text').keypress(
        function(e) {
            if (e.keyCode == 13) {
                return false
            }
        });

    // close advanced search form and return
    $('#back_button').click(function() {
        $('#adv_search_container').hide();
        $('#question_container').hide();
        $('#results_container').hide();
        $('#search_results_container').hide();
        $('#filter_results_container').hide();
        $('#search_form_container').show();
    });

    $("#close_question").click(function(){
		$("#close_modal").modal('show');
	});
	$("#close_modal").modal({
		closable: true
	});

    // close question container
    $('#confirm_close_question').bind('click',

        function() {
            $('#question_tags').empty();
            $("#question_form").empty();
            $('#question_number').empty();
            $('#question_title').empty();
            $("#answered_questions").empty();
            $("#qa_title").prop("checked", false);
            $("#qa_title_checkbox").hide();
            $("#answered_questions_container").hide();



            $('#question_container').hide();
            $('#results_container').show();
            $('#search_results_container').show();
            $('#filter_results_container').hide();
            $('#search_form_container').show();
            semantiUIInit(); // refresh table.

            $.blockUI({
                message: '<div class="ui segment"><div class="ui active dimmer">Loading...<div class="ui text loader"></div></div></div>',
                css: {
                    border: 'none',
                    '-webkit-border-radius': '40px',
                    '-moz-border-radius': '40px',
                    opacity: .5,
                },
            });
            $.getJSON($SCRIPT_ROOT + '/_clean', function(data) {
                $(document).scrollTop(0);
            });
        });

});
$(document).ajaxStop($.unblockUI);