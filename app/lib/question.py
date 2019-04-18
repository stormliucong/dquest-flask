from app import general_pool_criteria,general_pool_aact

def init_working_nct_id_list(rnct):
    '''
    initialize working nct id list
    :param rnct: returned from ctgov search results [...,'NCT02733523;3431','NCT02075840;3432',...]
    :return: a working nct id list
    '''
    working_nct_id_list  = [[record.split(';')[0], int(record.split(';')[1]), 0] for record in rnct]
    return working_nct_id_list


# working_nct_id_list = [['NCT02901717', 3431, 0], ['NCT01287182', 3432, 0],['NCT01035944', 3432, 0],['NCT00562068', 3431, 1], ['NCT00742300', 3431, 2]]
# question_answer_list = [{'answer': {}, 'question': {'domain': 'condition', 'entity_text': 'pregnant'}} ]
def find_new_question(question_answer_list,working_nct_id_list):
    '''
    find new question by frequency.
    alternatively, information entropy should be considered sum(plog(p))
    :param question_answer_list: questions already answered or skipped with their corresponding answers
    :param working_nct_id_list: a working nct id list
    :return: a updated question_answer_list by appending a new question

    Example
    working_nct_id_list = [['NCT02901717', 3431, 0], ['NCT01287182', 3432, 0],['NCT01035944', 3432, 0],['NCT00562068', 3431, 1], ['NCT00742300', 3431, 2]]
    question_answer_list = [{'answer': {}, 'question': (3, u'pregnant')}]
    '''
    # working_nct_id_frame = pd.DataFrame(working_nct_id_list,columns=['nct_id', 'ctgov_rank', 'num_of_question'])
    working_nct_id_0 = [record[0] for record in working_nct_id_list if record[2] == 0]
    active_question_0 = [qa['question']['entity_text'] for qa in question_answer_list]
    conn = general_pool_criteria.connection()
    cur = conn.cursor()

    placeholders1 = ",".join("?" * len(working_nct_id_0))
    ########################################################################################################################
    # placeholders1 = ",".join("?" * 2000)
    # working_nct_id_0 = [record[0] for record in working_nct_id_list if record[2] == 0][0:2000]
    # ERROR is raised if the nct list is larger than 2000
    # Use subsampling to solve this issue.
    # Select the first 2000 is better.
    if len(working_nct_id_0) > 2000:
        placeholders1 = ",".join("?" * 2000)
        # print(len(working_nct_id_0))
        # random.shuffle(working_nct_id_0)
        working_nct_id_0 = working_nct_id_0[0:2000]
    ########################################################################################################################
    placeholders2 = ",".join("?" * len(active_question_0))
    params = []
    params.extend(working_nct_id_0)
    # print(working_nct_id_0)
    if len(active_question_0) == 0:
        sql = """
                select top(1) count(distinct nctid) AS count, entity_text 
                from dbo.ec_condition 
                where nctid in (%s)  
                group by entity_text 
                order by count(distinct nctid) desc
            """ % (placeholders1)
    else:
        params.extend(active_question_0)
        sql = """
                select top(1) count(distinct nctid) AS count, entity_text 
                from dbo.ec_condition 
                where nctid in (%s)  
                and entity_text not in (%s)
                group by entity_text 
                order by count(distinct nctid) desc
            """ % (placeholders1, placeholders2)
    # print(sql)
    # print(params)
    cur.execute(sql, params)
    next_concept = cur.fetchall()
    conn.close()
    cur.close()
    if len(next_concept) > 0:
        this_q = {'question':{'domain':'condition','entity_text':next_concept[0][1]}}
    else:
        this_q = {'question':{'domain':'END','entity_text':'NO QUESTIONS FOUND FOR THE REMAININGS!!!'}}
    question_answer_list.append(this_q)
    return question_answer_list

# print(find_new_question([],working_nct_id_list))

def find_nct_details(working_nct_id_list,npag):
    '''
    find nct details by connecting to AACT
    :param working_nct_id_list:
    :param npag: page number of result to return
    :return: nct_details_for_this_page is a list of list [[nct_id1, nct_title, nct_summary],[]]. similar to (n, nct) = ctgov.search (stxt, npag)
    '''
    nct_details_for_this_page = []
    # print(working_nct_id_list)
    working_nct_id_0 = [(record[0], record[1]) for record in working_nct_id_list if record[2] == 0]
    srt_working_nct_id_0 = sorted(working_nct_id_0, key=lambda x: x[1], reverse=False)
    start_idx = (npag - 1) * 20
    end_idx = min(len(srt_working_nct_id_0), npag * 20)
    nct_id_this_page = [srt[0] for srt in srt_working_nct_id_0[start_idx:end_idx]]
    nct_id_rank = {}
    for srt in srt_working_nct_id_0[start_idx:end_idx]:
        nct_id_rank[srt[0]] = srt[1]

    # nct_id_this_page = ['NCT02901717','NCT01287182']
    conn = general_pool_aact.connection()
    cur = conn.cursor()
    sql = """
                   select c.nct_id,s.brief_title,c.name
                   from studies AS s
                   left join conditions AS c
                   on s.nct_id = c.nct_id
                   where s.nct_id in %s
               """
    cur.execute(sql, (tuple(nct_id_this_page),))
    details = cur.fetchall()
    conn.close()
    cur.close()
    # join condition
    nct_id_condition = {}
    nct_id_title = {}
    for r in details:
        if r[0] not in nct_id_condition.keys():
            nct_id_condition[r[0]] = r[2];
        else:
            nct_id_condition[r[0]] += ',' + r[2];

        if r[0] not in nct_id_title.keys():
            nct_id_title[r[0]] = r[1];

    nct_details_for_this_page = [[nct_id,nct_id_rank[nct_id],nct_id_title[nct_id],nct_id_condition[nct_id]] for nct_id in nct_id_condition.keys()]
    nct_details_for_this_page = sorted(nct_details_for_this_page, key=lambda x: x[1], reverse=False)
    return nct_details_for_this_page

def find_size_of_active_trials(working_nct_id_list):
    '''
    find size of the remaining trials
    :param working_nct_id_list:
    :return: size
    '''
    size = 0
    working_nct_id_0 = [record[0] for record in working_nct_id_list if record[2] == 0]
    size = len(working_nct_id_0)
    return size

# working_nct_id_list = [['NCT02901717', 3431, 0], ['NCT01287182', 3432, 0],['NCT01035944', 3432, 0],['NCT00562068', 3431, 1], ['NCT00742300', 3431, 2]]
# question_answer_list = [{'answer':{'include':'EXC'},'question': {'domain': 'condition', 'entity_text': 'pregnant'}} ]
def update_working_nct_id_list(question_answer_list,working_nct_id_list):
    '''
    update working_nct_id_list by comparing question_answer_list with criteria knowledge base
    :param question_answer_list:
    :param working_nct_id_list:
    :return: an updated working_nct_id_list

    working_nct_id_list = [('NCT02901717', 3431, 0), ('NCT01287182', 3432, 0),('NCT01035944', 3432, 0),('NCT00562068', 3431, 1),('NCT00742300', 3431, 2),]
    question_answer_list = [{'answer': {}, 'question': (3, u'pregnant')}]
    '''
    question_number = len(question_answer_list)
    if question_number > 0:
        this_qa = question_answer_list[question_number-1]
        this_entity_text = this_qa['question']['entity_text']

        if 'answer' not in this_qa.keys():
            return working_nct_id_list

        this_include = this_qa['answer']['include']

        conn = general_pool_criteria.connection()
        cur = conn.cursor()
        params = []
        params.append(this_entity_text)
        params.append(this_include)
        params.append(this_include)

        sql =   """
                    select distinct nctid
                    from dbo.ec_condition
                    where entity_text in (%s)
                    and ((include in (%s) and neg = 1) 
                    or (include not in (%s) and neg = 0))
                """ % ("?","?","?")

        # print(sql)
        # print(params)
        cur.execute(sql, params)
        filtered_nct_id = [nct_id[0] for nct_id in cur.fetchall()]
        conn.close()
        cur.close()
        for nct_record in working_nct_id_list:
            if nct_record[0] in filtered_nct_id and nct_record[2] == 0:
                nct_record[2] = question_number
        return working_nct_id_list
    else:
        return working_nct_id_list
# print(update_working_nct_id_list(question_answer_list,working_nct_id_list))