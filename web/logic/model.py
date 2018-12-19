import json

class MyMode1(object):
	"""docstring for MyMode1"""
	def __init__(self, toUser, template_id, url, data):
		super(MyMode1, self).__init__()
		self.__dict = dict()
		self.__dict['touser'] = toUser
		self.__dict['template_id'] = template_id
		self.__dict['url'] = url
		self.__dict['data'] = data

	def compose(self):
		return json.dumps(self.__dict, ensure_ascii = False).decode('utf-8').encode('utf-8')#

		



