# -*- coding:utf-8 -*-

import tornado.web
import hashlib
import urllib
import urllib2
import json
import copy
import time
from datetime import datetime
from bson import ObjectId
import tornado,cStringIO
from mongo_util import MongoIns;mongo_util = MongoIns()
from kpages import srvcmd
from kpages import url,ContextHandler
from tornado.web import RequestHandler, ErrorHandler
from logic import receive
from logic import reply
from logic import message
from logic import material
from logic import model
from tornado import httpclient
from tornado import httputil

def get_app_info(tag):
	if tag == 'tag1':
		return ('wx31da8356c59d346a', 'f2bebe6ddf0635ed4121301eb69b5d4d')
	else:
		return ('wxc8c378ff14e8442c', '9649364afadebbfdec1fcf98bb9139dc')


class BaseHandler(ContextHandler,tornado.web.RequestHandler):
	def set_default_headers(self):
		self.set_header("Access-Control-Allow-Origin", "*")
		self.set_header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With")
		self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')

	def options(self, *args, **kwargs):
		self.set_header("Access-Control-Allow-Origin", "*")
		self.set_header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With")
		self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')


	#获取 accessToken
	def getAccessToken(self, flag):
		access_token = ''
		expires_in = 0
		login_client = httpclient.HTTPClient()
		appid,secret = get_app_info(flag)

		try:
			response = login_client.fetch('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret)
			body = response.body
			body = json.loads(body)
			print body,'body'
			if body:
				access_token = body.get('access_token','')
				expires_in = int(body.get('expires_in',0))
				self.access_token = access_token
		except httpclient.HTTPError as e:
			print("Error: "+str(e))
		except Exception as e:
			print("Error: "+str(e))
		finally:
			login_client.close()
		return dict(access_token = access_token, expires_in = expires_in)

	def setMenu(self, menu, token):
		#https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN
		#import pdb;pdb.set_trace()
		url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+token
		print url
		menu = menu.encode('utf-8')
		url_request = urllib.urlopen(url=url, data = menu )
		back = url_request.read()
		return back

	    #获取素材列表
	def batch_get(self, accessToken, mediaType, offset=0, count=20):
		postUrl = ("https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=%s" % accessToken)
		postData = ("{ \"type\": \"%s\", \"offset\": %d, \"count\": %d }"% (mediaType, offset, count))
		urlResp = urllib2.urlopen(postUrl, postData)
		print urlResp.read()

	def getMedia(self, token):
		#https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=ACCESS_TOKEN
		self.batch_get(token, 'image')

	def getLoginToken(self, code):
		url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx31da8356c59d346a&secret=f2bebe6ddf0635ed4121301eb69b5d4d&code="+code+"&grant_type=authorization_code"
		urlRequest = urllib.urlopen(url)
		back = urlRequest.read()
		return back

	def refresh_login_token(self, refresh_token):
		#https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
		url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=wx31da8356c59d346a&grant_type=refresh_token&refresh_token="+refresh_token
		urlRequest = urllib.urlopen(url)
		back = urlRequest.read()
		return back

	def get_user_info(self, token, user_id):
		url = "https://api.weixin.qq.com/sns/userinfo?access_token="+token+"&openid="+user_id+"&lang=zh_CN" 
		urlRequest = urllib.urlopen(url)
		back = urlRequest.read()
		return back

	def sensor_cmd_login(self,username, pwd):
		postUrl = "http://tcas2.thunics.org/m/login"
		postData = ("{ \"loginname\": \"%s\", \"pwd\": \"%s\" }"% (username, pwd))
		urlResp = urllib2.urlopen(postUrl, postData)
		print urlResp.read()

	def setUp(self, data):#59424044623c4401c0e5d106
		response = dict(body = {})
		login_client = httpclient.HTTPClient()
		request = httpclient.HTTPRequest("http://tcas2.thunics.org/m/login",method = 'POST',body = urllib.urlencode(data))
		try:
			response = login_client.fetch(request)
		except httpclient.HTTPError as e:
			print("Error: "+str(e))
		except Exception as e:
			print("Error: "+str(e))
		finally:
			login_client.close()
		return response.body

	def send_base(self, msg, url):
		urlResp = urllib2.urlopen(url,msg)
		return urlResp.read()

	def send(self, msg, token):
		#https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN
		postUrl = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token="+token
		urlResp = urllib2.urlopen(postUrl,msg)
		return urlResp.read()

	def robot(self, msg, user):
		postUrl = "http://www.tuling123.com/openapi/api"
		send = {
		'key':"ac73f1827a854c7eb2798b0a8046503f",
		'info':msg,
		'loc':'北京市海淀区上地东路1号院',
		'userid':user
		}

		msg = json.dumps(send, ensure_ascii = False).decode('utf-8').encode('utf-8')#
		print msg
		urlResp = urllib2.urlopen(postUrl,msg)
		return urlResp.read()

	def tuling_robot(self,msg, user):#59424044623c4401c0e5d106
		response = dict(body = {})
		login_client = httpclient.HTTPClient()
		data = {
		'key':"ac73f1827a854c7eb2798b0a8046503f",
		'info':msg,
		'loc':'北京市海淀区上地东路1号院',
		'userid':user
		}
		request = httpclient.HTTPRequest("http://www.tuling123.com/openapi/api",method = 'POST',body = urllib.urlencode(data))
		try:
			response = login_client.fetch(request)
		except httpclient.HTTPError as e:
			print("Error: "+str(e))
		except Exception as e:
			print("Error: "+str(e))
		finally:
			login_client.close()
		return response.body

	def setMenu2(self, menu):
		#https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN
		menu_client = httpclient.HTTPClient()
		#import pdb;pdb.set_trace()
		url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+self.access_token
		print url
		menu = menu.encode('utf-8')
		#url_request = urllib.urlopen(url=url, data = menu )
		request = httpclient.HTTPRequest(url, method = "POST",body= urllib.urlencode(json.loads(menu)))#urllib.urlencode()
		back = "{}"
		print back
		try:
			response = menu_client.fetch(request)
			back = response.body
			print back
		except Exception as e:
			print("Error: "+str(e))
		finally:
			menu_client.close()
		return back

	#模板消息
	#设置行业
	def set_industry(self, access_token):
		#政府与公共事业	公共事业|非盈利机构	21
		#其它	其它	41
		postUrl = ("https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token=%s" % access_token)
		postData = ("{ \"industry_id1\": \"%s\", \"industry_id2\": \"%s\"}"% ("21","41"))
		urlResp = urllib2.urlopen(postUrl, postData)
		back = urlResp.read()
		return back

	def get_set_industry(self, token):
		url = "https://api.weixin.qq.com/cgi-bin/template/get_industry?access_token="+token
		urlRequest = urllib.urlopen(url)
		back = urlRequest.read()
		return back

	def send_model_msg(self, access_token, msg):
		#print self.set_industry(access_token),'set'
		#print self.get_set_industry(access_token),'get'
		postUrl = ("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=%s" % access_token)
		print msg,'mod'
		return self.send_base(msg, postUrl)



@url('/msg')
class MsgHandler(BaseHandler):
	"""docstring for MsgHandler"""
	def get(self):
		kwargs = dict((k, v[-1]) for k, v in self.request.arguments.items())
		print kwargs
		self.write(dict(status = True, back = {}, msg = "消息收到-Get"))

	def post(self):
		kwargs = dict((k, v[-1]) for k, v in self.request.arguments.items())
		print kwargs
		send = int(self.get_argument('send',0))
		if send:
			msg = str(self.get_argument('msg',""))
			user = str(self.get_argument('user',''))
			_type  = str(self.get_argument('type','text'))
			if _type == 'model':
				data = dict(
		                name = dict(value = "开源大桥2222", color = "#743a3a"),
		                disease = dict(value = "震动病害",color = "#ff0000"),
		                breakratio = dict(value = "很严重，损失比例达到28%", color = "#c4c400"),
		                data = dict(value = "严重不完整",color = "#0000ff"),
		                desc = dict(value = "暂无描述信息", color = "#008000"),
		                remark = dict(value = "2017年11月27日 早上9:30", color = "#908765")
		            )
				back = message.send_message(
					dict(toUser = user, type = _type, template_id = 'nt_u__tv8v7HT6pJHH8BQHFOGPUAwaxwCEKeCatOmjk', url = 'http://sjz.thunics.com', data = data))
				print back,'model-msg'
				if int(back.get('errcode',-1)) == 0:
					self.write(dict(status = True, msg = back.get('errmsg','')))
				else:
					self.write(dict(status = False, msg = back.get('errmsg','')))
				return
			else:
				back = message.send_message(dict(toUser = user , type = _type, content = msg))
				print back,'back1'
				if int(back.get('errcode',-1)) == 0:
					self.write(dict(status = True, msg = back.get('errmsg','')))
				else:
					self.write(dict(status = False, msg = back.get('errmsg','')))
				return
		self.write(dict(status = True, back = {}, msg = "消息收到-Post"))




@url('/login')
class LoginDemo(BaseHandler):
	"""docstring for ClassName"""
	def get(self):
		kwargs = dict((k, v[-1]) for k, v in self.request.arguments.items())
		if kwargs and kwargs.get('code',''):
			code = kwargs.get('code','')
			back = self.getLoginToken(code)
			if back:
				back = json.loads(back)
				token = back.get('access_token','')
				openid = back.get('openid','')
				if token and openid:
					user = self.get_user_info(token, openid)
					if user:
						self.render('www/index.html',next_url = "",user = json.loads(user), user_str = user)
					else:
						self.write(dict(status = False, msg = "error"))
			else:
				self.write(dict(status = False, msg = "error"))
		else:
			#self.redirect("http://t-lijiakui.thunics.org/login")
			self.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx31da8356c59d346a&redirect_uri=http://t-lijiakui.thunics.org/login&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect")

	def post(self):
		print 'POST'
		user = self.get_argument('user')
		pwd = self.get_argument('pwd')
		param = self.get_argument('param','{}')
		param =  json.loads(param)
		if param:
			openid = str(param.get('openid',''))
			nickname = str(param.get('nickname',''))
			city = str(param.get('city',''))
			print "openid: "+openid+" nickname: "+nickname+" city: "+city;
			login_info = self.setUp(dict(loginname = user, pwd = pwd, param = param))
			if login_info:
				self.write(login_info)
			else:
				self.write(dict(status = False, msg = "认证失败-1!"))
		else:
			self.write(dict(status = False, msg = "认证失败-2!"))




@url(r'/media')
class GetMedia(BaseHandler):
	"""docstring for ClassName"""
	def get(self):
		token = self.get_argument('token')
		if token:
			back = self.getMedia(token)
			if back:
				back = json.loads(back)
				if int(back.get('errcode',-1)) == 0:
					self.write(dict(msg = "设置成功了...", status = True, back = back))
				else:
					self.write(dict(msg = "设置error了...", status = False, back = {}))
			else:
				self.write(dict(msg = "设置error了...", status = False, back = {}))
		else:
			self.write(dict(msg = "设置error了...", status = False, back = {}))


@url(r'/material')
class GetMaterial(BaseHandler):
	"""docstring for GetMaterialList"""
	def get(self):
		material_type = self.get_argument('type','image')
		token = self.get_argument('token','')
		myMaterial = material.Material()
		print material_type, token
		data = myMaterial.batch_get(token, material_type)
		print data,'get'
		if data:
			data = json.loads(data)
			if data.get('errcode',0) == 0:
				kwargs = {}
				kwargs['type'] = material_type
				kwargs['data'] = data.get('item',[])
				kwargs['token'] = token
				ts = time.time()
				addon = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(ts))
				kwargs['ts'] = ts
				kwargs['addon'] = addon
				status = MongoIns().m_insert("weixin_material",**kwargs)
				print 'insert',status
				self.write(dict(status = True, msg = '获取到了',data = kwargs))
			else:
				self.write(dict(status = False, msg = '调取失败',data = []))
		else:
			data = []
			self.write(dict(status = False, msg = '没有哦',data = data))



@url(r'/material/list')
class GetMaterialList(BaseHandler):
	"""docstring for GetMaterialList"""
	def get(self):
		material_type = self.get_argument('type','image')
		print material_type
		data,_ = MongoIns().m_list("weixin_material",sorts = [('ts', -1)], type = material_type)
		print data
		if data and len(data) >0:
			data = data[0].get('data',[])
			self.write(dict(status = True, msg = '获取到了',data = data))
		else:
			data = []
			self.write(dict(status = False, msg = '没有哦',data = data))


DB_HOST = "192.168.111.10:27037"
@url(r"/list/data")
class DataListHandler(BaseHandler):
	"""此处专门负责获取和存储Token"""

	def get_data(self, table):
		if table == 'data_m':
			return '你妹的，你难道不知道这样做很卫星吗？'
		else:
			datas,_ = mongo_util.m_list(table, dbname='wf_HuaRui',host=DB_HOST,findall=True, fields={'FanID':1})
			FinIDs = []
			for item in datas:
				FinID = item.get('FanID')
				if FinID not in FinIDs:
					FinIDs.append(FinID)
			FinIDs = sorted(FinIDs, key=lambda x: x)
			return FinIDs
	def get(self):
		table = self.get_argument('table', 'data_d')
		data = self.get_data(table)
		self.write(dict(data=data))


@url(r"/alarm/data")
class DataListHandlerww(BaseHandler):
	"""此处专门负责获取和存储Token"""

	def get_data(self, table):
		if table == 'data_m':
			return '你妹的，你难道不知道这样做很卫星吗？'
		else:
			datas,_ = mongo_util.m_list(table, dbname='wf_HuaRui',host=DB_HOST,findall=True, fields={'fj_num':1})
			FinIDs = []
			for item in datas:
				FinID = item.get('fj_num')
				if FinID not in FinIDs:
					FinIDs.append(FinID)
			FinIDs = sorted(FinIDs, key=lambda x: x)
			return FinIDs
	def get(self):
		table = self.get_argument('table', 'alarm')
		data = self.get_data(table)
		self.write(dict(data=data))


@url(r'/curve/abbgt')
class CurveABBGTPreview(BaseHandler):
	"""docstring for CurvePreview"""
	def get(self):
		self.render('ABBGT.html')


@url(r'/curve/bachmann')
class CurveBachmannPreview(BaseHandler):
	"""docstring for CurvePreview"""
	def get(self):
		self.render('Bachmann.html')

@url(r'/curve/preview')
class CurvePreview(BaseHandler):
	"""docstring for CurvePreview"""
	def get(self):
		self.render('drawer.html')


@url(r'/fix')
class CurveAll2Preview(BaseHandler):
	"""docstring for CurvePreview"""
	def get(self):
		self.render('road_guany.html')


@url(r'/')
class CurveAllPreview(BaseHandler):
	"""docstring for CurvePreview"""
	def get(self):
		self.render('drawer.html')

@url(r"/update")
class UpdateToken(BaseHandler):
	"""此处专门负责获取和存储Token"""
	def get(self):
		flag = self.get_argument('flag','tag1')
		token = self.getAccessToken(flag)
		print token
		kwargs = {}
		if token:
			kwargs = token
			ts = time.time()
			addon = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(ts))
			kwargs['ts'] = ts
			kwargs['addon'] = addon
			forum_id = "59fc0700a02b2a01059a4d3f"
			MongoIns().m_update("access_token",{'_id' : ObjectId(forum_id)},**kwargs)
			self.write(dict(status = True, msg = "获取Token成功!", token = kwargs))
		else:
			self.write(dict(status = False, msg = "Toekn获取失败!"))



@url(r"/menu")
class Test1(BaseHandler):
	"""渲染demo界面"""
	def post(self):
		menu = self.get_argument("menu","{}")
		token = message.get_access_token("tag2")
		#menu = json.loads(menu)
		if menu and token:
			back = self.setMenu(str(menu), token)
			if back:
				print back
			back = json.loads(back)
			if back and int(back.get('errcode',-1)) == 0:
				self.write(dict(msg = "设置成功了...", status = True))
			elif back:
				self.write(dict(msg = back.get('errmsg','error'), status = False))
			else:
				self.write(dict(msg = "error", status = False))
		else:
			self.write(dict(msg = "error", status = False))



@url(r'/webgl/point1')
class WebPoint1(BaseHandler):
	"""docstring for WebPoint1"""
	def get(self):
		self.render('webgl/HelloPoint1.html')



@url(r'/demo')
class Test2(BaseHandler):
	"""docstring for ClassName"""
	def get(self):
		signature = self.get_argument('signature','')
		timestamp = self.get_argument('timestamp','')
		nonce = self.get_argument('nonce','')
		echostr = self.get_argument('echostr','')
		token = u"ljk123"
		array = [token, timestamp, nonce]
		print 'array',array
		array.sort()
		print 'array',array
		sha1 = hashlib.sha1()
		map(sha1.update, array)
		hashcode = sha1.hexdigest()
		print hashcode,signature
		if hashcode == signature:
			self.write(echostr)
		else:
			self.write('success')


	def post(self):
		print self.request.arguments,'POST'
		body = self.request.body
		back = ""
		print "Handle Post webdata is ", body
		recMsg = receive.parse_xml(body)
		print recMsg
		if isinstance(recMsg, receive.Msg):
			toUser = recMsg.FromUserName
			fromUser = recMsg.ToUserName
			if recMsg.MsgType == 'text':
				back = self.tuling_robot(recMsg.Content,toUser)
				content = "你说的我没弄明白哦😯😯😯"
				if back:
					back = json.loads(back)
					print back.get('code',0)
					content =  back.get('text','')
				replyMsg = reply.TextMsg(toUser, fromUser, content)
				back = replyMsg.send()
			if recMsg.MsgType == 'image':
				mediaId = recMsg.MediaId
				replyMsg = reply.ImageMsg(toUser, fromUser, mediaId)
				back = replyMsg.send()
		elif isinstance(recMsg, receive.EventMsg):
			toUser = recMsg.FromUserName
			fromUser = recMsg.ToUserName
			if recMsg.Event == 'CLICK':
				if recMsg.Eventkey == 'mpGuide':
					content = u"编写中，尚未完成---8".encode('utf-8')
					replyMsg = reply.TextMsg(toUser, fromUser, content)
					back = replyMsg.send()
				elif recMsg.Eventkey == 'click_band':
					content = u"绑定账户需要输入你的sensorcmd用户名和密码".encode('utf-8')
					replyMsg = reply.TextMsg(toUser, fromUser, content)
					back = replyMsg.send()
				else:
					content = u"编写中，尚未完成----0".encode('utf-8')
					replyMsg = reply.TextMsg(toUser, fromUser, content)
					back = replyMsg.send()

			elif recMsg.Event == 'VIEW':
				print toUser,"toUser"
				self.set_secure_cookie("username",toUser)
				print self.get_secure_cookie('username'),'---'
				print toUser,fromUser
				if recMsg.Eventkey == 'http://t-lijiakui.thunics.org/login':
					#
					content = u"打开网页".encode('utf-8')
					replyMsg = reply.TextMsg(toUser, fromUser, content)
					back = replyMsg.send()
				else:
					content = u"编写中，尚未完成----0".encode('utf-8')
					replyMsg = reply.TextMsg(toUser, fromUser, content)
					back = replyMsg.send()
		else:
			print "暂且不处理"
			back = reply.Msg().send()
		print back
		self.write(back)



		


		
