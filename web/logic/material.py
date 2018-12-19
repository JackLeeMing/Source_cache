# -*- coding: utf-8 -*-
# filename: material.py
import urllib2
import json
import poster.encode
from poster.streaminghttp import register_openers
from basic import Basic

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
            "title": "美丽的阿秀姑娘",
            "thumb_media_id": media_id,
            "author": "李嘉魁魁",
            "digest": "alafate",
            "show_cover_pic": 1,
            "content": 
            """
            <p>
            <p>美丽的阿秀姑娘啊，如此之善良纯洁可爱，仕宦当作执金吾，娶妻当得白阿秀</p>
            <img data-s=\"300,640\" data-type=\"jpeg\" data-src=\"http://sjz.thunics.com/getimg?fid=59e878bc914b57000b3b8683\" data-ratio=\"0.748653500897666\" data-w=\"\"  />
            <br  />
            <img data-s=\"300,640\" data-type=\"jpeg\" data-src=\"http://mmbiz.qpic.cn/mmbiz/iaK7BytM0QFPLhxfSMhOHlZd2Q5cw3YibKiaibdNgh0ibgOXAuz9phrGjYFBUKlyTBcrv5WE5zic08FUcz5ODXCHEykQ/0?wx_fmt=jpeg\" data-ratio=\"0.748653500897666\" data-w=\"\"  />
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
    myMaterial = Material()
    accessToken = "mK-pn6EOEvjei0PYsHGPWKz5B6vU_P_lkY2pOrh1yuTjKDleXgLVHeVfhrdzUUjeZaPC4wptxLoLGRv0DiA36oNMFrR2q_xYwK2jm0hNq_9_UNRJ9YrYj6hWNQ8u_xx1EIEaADAJNJ"
    # mediaType = "image"
    # #myMaterial.uplaod(accessToken,'/Users/mac/media/axiu1.jpg',mediaType)
    # myMaterial.uplaod(accessToken,'/Users/mac/media/axiu2.jpg',mediaType)
    # myMaterial.uplaod(accessToken,'/Users/mac/media/axiu3.jpg',mediaType)
    # myMaterial.batch_get(accessToken, mediaType)
    myMaterial.getNews(accessToken,'X4qpK58x8ryIxiAnSsk1r4kV-IAAtgiPoWHpFX29Z3U')
