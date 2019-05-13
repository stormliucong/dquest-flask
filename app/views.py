from app import app
from flask import render_template, jsonify, request, session
from lib.log import logger
import lib.oformat as of
import lib.ctgov as ctgov
import lib.question_info_entropy as qst

log = logger ('dquest-view')


# home page
@app.route('/')
def index ():
    # get trial number
    nnct = ctgov.get_nct_number ('http://clinicaltrials.gov/search?term=&displayxml=True&count=0')
    # search form    
    # form = SearchForm()
    return render_template('index.html', nnct = of.format_nct_number(nnct))


# search for clinical trials
@app.route('/_ctgov_search')
def ctgov_search ():
    stxt = request.args.get ('stxt')
    npag = request.args.get ('npag')
    (n, nct) = ctgov.search (stxt, npag)
    if (stxt is None) or (len(stxt) == 0):
        stxt = 'all'
    if npag == '1':
        log.info('%s -- ct.gov-search: q("%s") - res(%s trials)' % (request.remote_addr, stxt, n))
    return jsonify (n=n, nct=nct, q=stxt, npag=npag)

# advanced search for clinical trials.
@app.route('/_adv_search')
def ctgov_advanced_search():
    (n, nct) = ctgov.advanced_search(request.args)
    # term = request.args.get('term')
    npag = request.args.get('npag')
    fq = of.format_query2print (request.args)
    if npag == '1':
        log.info('%s -- ct.gov-advanced-search: q(%s) - res(%s trials)' % (request.remote_addr, fq, n))
    print(fq)
    return jsonify (n=n, nct=nct, q = fq, npag = npag)

# start question and init working_nct_id_list and question_answer_list.
@app.route('/_start_question')
def start_question():
    # get parameters
    stxt = request.args.get
    ('stxt')
    # save the query in session
    session.clear()
    session['query'] = stxt
    session.modified = True
    # get trials and tags
    rnct = ctgov.get_initial_nct (stxt)
    working_nct_id_list = qst.init_working_nct_id_list(rnct)
    question_answer_list = []
    question_answer_list = qst.find_new_question(question_answer_list,working_nct_id_list)
    log.info ('%s -- first question' % (request.remote_addr))
    return jsonify (question_answer_list = question_answer_list, working_nct_id_list = working_nct_id_list)

# start question and init working_nct_id_list and question_answer_list.
@app.route('/_pts_start_question')
def start_question_detail():
    # get parameters
    cond = request.args.get('cond')
    locn = request.args.get('locn')

    # save the query in session
    session.clear()
    session['query'] = cond
    session.modified = True
    # get trials and tags
    rnct = ctgov.get_initial_nct_patient(cond,locn)
    working_nct_id_list = qst.init_working_nct_id_list(rnct)
    question_answer_list = []
    if len(working_nct_id_list) > 0:
        question_answer_list = qst.find_new_question(question_answer_list,working_nct_id_list)
        log.info ('%s -- first question' % (request.remote_addr))

    return jsonify (question_answer_list = question_answer_list, working_nct_id_list = working_nct_id_list)
# start question by adv seasrch and init working_nct_id_list and question_answer_list.
@app.route('/_advs_start_question')
def advs_start_question():
    qlabel = request.args.get('qlabel')
    # save the query in session
    session.clear()
    session['query'] = qlabel
    session.modified = True
    # get trials
    url = ctgov.form_advanced_search_url (request.args)
    rnct = ctgov.get_initial_nct_from_url (url)
    working_nct_id_list = qst.init_working_nct_id_list(rnct)
    question_answer_list = []
    if len(working_nct_id_list) > 0:
        question_answer_list = qst.find_new_question(question_answer_list,working_nct_id_list)
        log.info ('%s -- first question' % (request.remote_addr))
    return jsonify (question_answer_list = question_answer_list, working_nct_id_list = working_nct_id_list)

# load nct details.
@app.route ('/_find_nct_by_page', methods=['POST'])
def find_nct_by_page():
    requestion_dict = request.get_json()
    working_nct_id_list = requestion_dict['working_nct_id_list']
    npag = requestion_dict['npag']
    nct_details_for_this_page = qst.find_nct_details(working_nct_id_list,npag)
    size_of_active_trials = qst.find_size_of_active_trials(working_nct_id_list)
    return jsonify(working_nct_id_list = working_nct_id_list, npag = npag, nct_details_for_this_page = nct_details_for_this_page, size_of_active_trials = size_of_active_trials)

# confirm the question.
@app.route ('/_confirm', methods=['POST'])
def confirm():
    requestion_dict = request.get_json()
    question_answer_list = requestion_dict['question_answer_list']
    print(question_answer_list)
    working_nct_id_list = requestion_dict['working_nct_id_list']
    domain = requestion_dict['domain']
    working_nct_id_list = qst.update_working_nct_id_list(question_answer_list,working_nct_id_list)
    question_answer_list = qst.find_new_question(question_answer_list,working_nct_id_list,domain)
    return jsonify(question_answer_list = question_answer_list, working_nct_id_list = working_nct_id_list)

# close the session.
@app.route ('/_clean')
def clean ():
    q = session['query']
    session.clear()
    session.modified = True
    log.info ('%s -- tag cloud closed' % request.remote_addr)
    return jsonify (n=0, q=q)

