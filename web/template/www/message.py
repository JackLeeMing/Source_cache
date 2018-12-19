# -*- coding: utf-8 -*-
# filename: send.py
import urllib
import urllib2
import json
from kpages import get_context
from tornado import httpclient
from tornado import httputil


if __name__ == '__main__':
	#调用方式
	msg = 'msg'
	user = 'o69uf038Xf72IL-MipdfXpPedjC0'
	_type  = 'model'
	if _type == 'model':
		data = dict(
	            name = dict(value = "开源大桥6666", color = "#743a3a"),
	            disease = dict(value = "震动病害",color = "#ff0000"),
	            breakratio = dict(value = "很严重，损失比例达到28%", color = "#c4c400"),
	            data = dict(value = "严重不完整",color = "#0000ff"),
	            desc = dict(value = "暂无描述信息", color = "#008000"),
	            remark = dict(value = "2017年11月27日 早上9:30", color = "#908765"))
		resp = send_message(dict(
				toUser = user, 
				type = _type, 
				template_id = 'nt_u__tv8v7HT6pJHH8BQHFOGPUAwaxwCEKeCatOmjk', #模板消息id
				url = 'http://sjz.thunics.com', #模板消息外链接
				data = data)#消息填充数据 字典
				)
		if int(resp.get('errcode',-1)) == 0:
			self.write(dict(status = True, msg = resp.get('errmsg','')))
		else:
			self.write(dict(status = False, msg = resp.get('errmsg','')))
	else:
		resp = message.send_message(dict(toUser = user , type = _type, content = msg))
		if int(resp.get('errcode',-1)) == 0:
			self.write(dict(status = True, msg = resp.get('errmsg','')))
		else:
			self.write(dict(status = False, msg = resp.get('errmsg','')))

#微信测试号
def get_app_info(tag):
	if tag == 'tag1':
		return ('wx31da8356c59d346a', 'f2bebe6ddf0635ed4121301eb69b5d4d')
	else:
		return ('wxc8c378ff14e8442c', '9649364afadebbfdec1fcf98bb9139dc')


#将token 存入缓存
def set_token(key,token):
	r = get_context().get_redis()
	print '设置Token: ',token
	r.setex(key,token, 7000) 

#从缓存中读取token
def get_token(key):
	r = get_context().get_redis()
	token = r.get(key)
	print '从缓存获取Token: ',token
	return token


def get_token_new(flag):
	print '联网获取token'
	appid,secret = get_app_info(flag)
	postUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret
	urlResp = urllib2.urlopen(postUrl)
	response = urlResp.read()
	response = json.loads(response)
	access_token = response.get('access_token','')
	if access_token:
		set_token(appid, access_token)
	return access_token

#获取 accessToken 先从缓存读取， 不存在则重新获取
def get_access_token(flag):
	app_id,_ = get_app_info(flag)
	access_token = get_token(app_id)
	if access_token:
		return access_token
	else:
		return get_token_new(flag)

#发送模板消息
def send_model_msg(access_token, msg):
	postUrl = ("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=%s" % access_token)
	print msg,'mod'
	urlResp = urllib2.urlopen(postUrl,msg)
	return urlResp.read()

#发送其他消息
def send_normal_msg(msg, token):
	postUrl = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token="+token
	urlResp = urllib2.urlopen(postUrl,msg)
	return urlResp.read()

def send_message(params):
	flag = params.get('flag','tag2')
	token = get_access_token(flag)
	if not token:
		return dict('errcode' == -1 , 'errmsg' == '无法获取Token')
	if params.get('type','') == 'text':
		return TextMessage(
			params.get('toUser'), 
			params.get('content')).compose().send(token)
	elif params.get('type','') == 'image':
		return ImageMessage(
			params.get('toUser'), 
			params.get('content')).compose().send(token)
	elif params.get('type','') == 'news':
		return NewsMessage(
			params.get('toUser'), 
			params.get('content')).compose().send(token)
	elif params.get('type','') == 'mpnews':
		return MapNewMessage(
			params.get('toUser'), 
			params.get('content')).compose().send(token)
	elif params.get('type','') == 'model':
		return ModelMessage(
			params.get('toUser'), 
			params.get('template_id'), 
			params.get('url',''), 
			params.get('data',{})).compose().send(token)
	else:
		return TextMessage(params.get('toUser'), params.get('未知类型消息')).compose().send(token)


class BaseMessage(object):
	"""docstring for BaseMessage"""
	def __init__(self):
		pass

	def compose(self):
		return self

	def send(self, token):
		return dict()


class ModelMessage(BaseMessage):
	"""docstring for ModelMessage"""
	def __init__(self, toUser, template_id, url, data):
		super(ModelMessage, self).__init__()
		self.__dict = dict()
		self.__dict['touser'] = toUser
		self.__dict['template_id'] = template_id
		self.__dict['url'] = url
		self.__dict['data'] = data

	def send(self, token):
		back = dict();
		if self.message:
			back = send_model_msg(token, self.message)
			back = json.loads(back)
		return back

	def compose(self):
		self.message = json.dumps(self.__dict, ensure_ascii = False).decode('utf-8').encode('utf-8')#
		return self

class TextMessage(BaseMessage):
	"""docstring for TextMessage"""
	def __init__(self, toUser, content):
		super(TextMessage, self).__init__()
		self.__dict = dict()
		self.__dict['touser'] = toUser
		self.__dict['msgtype'] = 'text'
		self.__dict['text'] = dict()
		self.__dict['text']['content'] = content

	def compose(self):
		self.message = json.dumps(self.__dict, ensure_ascii = False).decode('utf-8').encode('utf-8')#
		return self

	def send(self, token):
		back = dict();
		if self.message:
			back = send_normal_msg(token, self.message)
			back = json.loads(back)
		return back


class ImageMessage(BaseMessage):
	"""docstring for ImageMessage"""
	def __init__(self, toUser, media_id):
		super(ImageMessage, self).__init__()
		self.__dict = dict()
		self.__dict['touser'] = toUser
		self.__dict['msgtype'] = 'image'
		self.__dict['image'] = dict()
		self.__dict['image']['media_id'] = media_id

	def compose(self):
		self.message = json.dumps(self.__dict, ensure_ascii = False).decode('utf-8').encode('utf-8')#
		return self

	def send(self, token):
		back = dict();
		if self.message:
			back = send_normal_msg(token, self.message)
			back = json.loads(back)
		return back

class NewsMessage(BaseMessage):
	"""docstring for ClassName"""
	def __init__(self, toUser, content):
		super(NewsMessage, self).__init__()
	 	self.__dict = {
	    "touser":str(toUser),
	    "msgtype":"news",
	    "news":{
	        "articles": [
	         {
	             "title":str(content),
	             "description":"Is Really A Happy Day",
	             "picurl":"http://mmbiz.qpic.cn/mmbiz_jpg/RJSRc4ePT3iaXJhBt1yZArqZcexZf2icEibaHo9yR1CL6SIkf1sXG5A1V64SaDYAKYd62agSibHlPBU75ALhSeaF0g/0?wx_fmt=jpeg"
	         },
	         {
	             "title":"Happy Day",
	             "description":"Is Really A Happy Day",
				 "content": 
		            """
		            <p>
		            <p>阿秀，最美的阿秀</p>
		            <img data-s=\"300,640\" data-type=\"jpeg\" data-src=\"http://mmbiz.qpic.cn\/mmbiz_jpg\/RJSRc4ePT3iaXJhBt1yZArqZcexZf2icEibqdy4F8PUnrLvYfkhg6sskJ71tzIh4lfrZnCfbFH0jI1E0ibBASFqObg/0?wx_fmt=jpeg\" data-ratio=\"0.748653500897666\" data-w=\"\"  />
		            <br  />
		            <img data-s=\"300,640\" data-type=\"jpeg\" data-src=\"http://mmbiz.qpic.cn\/mmbiz_jpg\/RJSRc4ePT3iaXJhBt1yZArqZcexZf2icEibbdFh5Md9MLsq3Ibtp0orUagibyIm4NqVBoKDSYFIeaxFXaKQib1cibjSQ/0?wx_fmt=jpeg\" data-ratio=\"0.748653500897666\" data-w=\"\"  />
		            <br  />
		            </p>""",
	             "picurl":"http://mmbiz.qpic.cn/mmbiz_jpg/RJSRc4ePT3iaXJhBt1yZArqZcexZf2icEibZicG5DS4ktyGPjBqvBdo9dzu5cDnhut4ZEcGDDbemowDcScqhDs2OZg/0?wx_fmt=jpeg"
	         }
	         ]
	    	}
		}

	def compose(self):
		self.message = json.dumps(self.__dict, ensure_ascii = False).decode('utf-8').encode('utf-8')#
		return self

	def send(self, token):
		back = dict();
		if self.message:
			back = send_normal_msg(token, self.message)
			back = json.loads(back)
		return back


class MapNewMessage(BaseMessage):
	"""docstring for ClassName"""
	def __init__(self,toUser, content):
		super(MapNewMessage, self).__init__()
		self.__dict = {
    		"touser":toUser,
    		"msgtype":"mpnews",
    		"mpnews":
    		{
        		"media_id":content
    		}
    	}

	def compose(self):
		self.message = json.dumps(self.__dict, ensure_ascii = False).decode('utf-8').encode('utf-8')#
		return self

	def send(self, token):
		back = dict();
		if self.message:
			back = send_normal_msg(token, self.message)
			back = json.loads(back)
		return back
		

		
		
		
