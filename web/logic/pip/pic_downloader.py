#-*- coding:utf-8 -*-
import re
import requests



def dowmloadPic(html,keyword):
    pic_url = re.findall('"objURL":"(.*?)",',html,re.S)
    i = 0
    print '找到关键词:'+keyword+'的图片，现在开始下载图片...'
    for each in pic_url:
        print '正在下载第'+str(i+1)+'张图片，图片地址:'+str(each)
        try:
            pic= requests.get(each, timeout=10)
        except requests.exceptions.ConnectionError:
            print '【错误】当前图片无法下载'
            continue
        string = 'pictures\\'+keyword+'_'+str(i) + '.jpg'
        #resolve the problem of encode, make sure that chinese name could be store
        fp = open(string.decode('utf-8').encode('cp936'),'wb')
        fp.write(pic.content)
        fp.close()
        i += 1

def dowmload_pic_one(fid):
    url = 'http://sjz.thunics.com/getimg?fid='+fid
    print '正在下载第图片地址:'+str(url)
    try:
        pic = requests.get(url, timeout = 10)
    except requests.exceptions.ConnectionError:
        print '【错误】当前图片无法下载'
    string = '/Users/mac/media/'+fid+'.jpg'
    #resolve the problem of encode, make sure that chinese name could be store
    fp = open(string.decode('utf-8').encode('cp936'),'wb')
    fp.write(pic.content)
    fp.close()
    print '图片下载完毕!'
    return string

if __name__ == '__main__':
    fid = raw_input("请输入图片fid: ")
    # url = 'http://image.baidu.com/search/flip?tn=baiduimage&ie=utf-8&word='+word+'&ct=201326592&v=flip'
    # result = requests.get(url)
    # dowmloadPic(result.text,word)
    if fid:
        print dowmload_pic_one(fid)
    else:
        print '你没有输入fid'
    

