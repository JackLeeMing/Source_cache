# -*- coding: utf-8 -*-
# filename: material.py
import urllib2
import json
import poster.encode
from poster.streaminghttp import register_openers
from basic import Basic
from   pic_downloader import dowmload_pic_one

class Material(object):
    def __init__(self):
        register_openers()
    #上传

        #上传图文
    def add_news(self, accessToken, news):
        postUrl = "https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=%s" % accessToken
        urlResp = urllib2.urlopen(postUrl, news)
        print urlResp.read()


    def uplaod(self, accessToken, filePath, mediaType):
        openFile = open(filePath, "rb")
        fileName = "hello"
        param = {'media': openFile, 'filename': fileName}
        #param = {'media': openFile}
        postData, postHeaders = poster.encode.multipart_encode(param)

        postUrl = "https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=%s&type=%s" % (accessToken, mediaType)
        request = urllib2.Request(postUrl, postData, postHeaders)
        urlResp = urllib2.urlopen(request)
        print urlResp.read(),'--- 数据上传'
    #下载
    def get(self, accessToken, mediaId):
        postUrl = "https://api.weixin.qq.com/cgi-bin/material/get_material?access_token=%s" % accessToken
        postData = "{ \"media_id\": \"%s\" }" % mediaId
        urlResp = urllib2.urlopen(postUrl, postData)
        headers = urlResp.info().__dict__['headers']
        if ('Content-Type: application/json\r\n' in headers) or ('Content-Type: text/plain\r\n' in headers):
            jsonDict = json.loads(urlResp.read())
            print jsonDict
        else:
            buffer = urlResp.read()  # 素材的二进制
            mediaFile = file("test_media.jpg", "wb")
            mediaFile.write(buffer)
            print "get successful"
    #删除
    def delete(self, accessToken, mediaId):
        postUrl = "https://api.weixin.qq.com/cgi-bin/material/del_material?access_token=%s" % accessToken
        postData = "{ \"media_id\": \"%s\" }" % mediaId
        urlResp = urllib2.urlopen(postUrl, postData)
        print urlResp.read()
    
    #获取素材列表
    def batch_get(self, accessToken, mediaType, offset=0, count=20):
        postUrl = ("https://api.weixin.qq.com/cgi-bin/material"
               "/batchget_material?access_token=%s" % accessToken)
        postData = ("{ \"type\": \"%s\", \"offset\": %d, \"count\": %d }"
                    % (mediaType, offset, count))
        urlResp = urllib2.urlopen(postUrl, postData)
        return urlResp.read()

    def getNews(self, accessToken, media_id):
		news =(
    {
        "articles":
        [
            {
            "title": "美丽的阿秀",
            "thumb_media_id": media_id,
            "author": "秀秀",
            "digest": "alafate",
            "show_cover_pic":1,
            "content": 
            """
            <p>
            <p>阿秀，最美的阿秀</p>
            <img data-s=\"300,640\" data-type=\"jpeg\" data-src=\"http://mmbiz.qpic.cn\/mmbiz_jpg\/RJSRc4ePT3iaXJhBt1yZArqZcexZf2icEibqdy4F8PUnrLvYfkhg6sskJ71tzIh4lfrZnCfbFH0jI1E0ibBASFqObg/0?wx_fmt=jpeg\" data-ratio=\"0.748653500897666\" data-w=\"\"  />
            <br  />
            <img data-s=\"300,640\" data-type=\"jpeg\" data-src=\"http://mmbiz.qpic.cn\/mmbiz_jpg\/RJSRc4ePT3iaXJhBt1yZArqZcexZf2icEibbdFh5Md9MLsq3Ibtp0orUagibyIm4NqVBoKDSYFIeaxFXaKQib1cibjSQ/0?wx_fmt=jpeg\" data-ratio=\"0.748653500897666\" data-w=\"\"  />
            <br  />
            </p>""",
            "content_source_url": "",
            },{
            "title": "美丽的阿秀",
            "thumb_media_id": '-waMGpJq6cgDs6PyBXQxqjnSdnJoqxCAURAIA-77M-s',
            "author": "秀秀",
            "digest": "alafate",
            "show_cover_pic": 2,
            "content": 
            """
            <p>
            <p>阿秀，最美的阿秀,秀秀</p>
            <br  />
            <img data-s=\"300,640\" data-type=\"jpeg\" data-src=\"http://mmbiz.qpic.cn\/mmbiz_jpg\/RJSRc4ePT3iaXJhBt1yZArqZcexZf2icEibqdy4F8PUnrLvYfkhg6sskJ71tzIh4lfrZnCfbFH0jI1E0ibBASFqObg/0?wx_fmt=jpeg\" data-ratio=\"0.748653500897666\" data-w=\"\"  />
            <br  />
            </p>""",
            "content_source_url": "",
            },{
            "title": "美丽的阿秀",
            "thumb_media_id":'-waMGpJq6cgDs6PyBXQxqlNZXgBbRJ6GB43y-hV0Y18',
            "author": "秀秀",
            "digest": "alafate",
            "show_cover_pic": 2,
            "content": 
            """
            <p>
            <p>阿秀，最美的阿秀，我的女神哦</p>
            <br  />
            <img data-s=\"300,640\" data-type=\"jpeg\" data-src=\"http://mmbiz.qpic.cn\/mmbiz_jpg\/RJSRc4ePT3iaXJhBt1yZArqZcexZf2icEibbdFh5Md9MLsq3Ibtp0orUagibyIm4NqVBoKDSYFIeaxFXaKQib1cibjSQ/0?wx_fmt=jpeg\" data-ratio=\"0.748653500897666\" data-w=\"\"  />
            <br  />
            </p>""",
            "content_source_url": "",
            }
        ]
    })
		#news 是个dict类型，可通过下面方式修改内容
		#news['articles'][0]['title'] = u"测试".encode('utf-8')
		#print news['articles'][0]['title']
		news = json.dumps(news, ensure_ascii=False)
		self.add_news(accessToken, news)


if __name__ == '__main__':
    fid = raw_input("请输入图片fid: ")
    access_token = raw_input("请输入access_token: ")
    if fid and access_token:
        myMaterial = Material()
        mediaType = "image"
        path = dowmload_pic_one(fid)
        myMaterial.uplaod(access_token,path,mediaType)
        # myMaterial.uplaod(accessToken,'/Users/mac/media/axiu2.jpg',mediaType)
        # myMaterial.uplaod(accessToken,'/Users/mac/media/axiu3.jpg',mediaType)
        #myMaterial.batch_get(accessToken, mediaType)
        #myMaterial.getNews(accessToken,'-waMGpJq6cgDs6PyBXQxqjnSdnJoqxCAURAIA-77M-s')
    else:
        print '参数输入不全!'
