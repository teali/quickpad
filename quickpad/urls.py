from django.conf.urls import patterns, include, url
from quickpad import views
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'quickpad.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^mycookie$',views.my_cookie),
    url(r'^settabs$',views.change_tabs),
    url(r'^setsettings$',views.change_settings),
	url(r'^$|^\w{8}$', views.main),
	url(r'^au', views.upload),
	url(r'^d/[\da-zA-z]+',views.direct_dl),
    url(r'^editfile$',views.change_file),
    url(r'^getrecent$',views.get_recent),
    url(r'^addrecent$',views.append_recent),
    url(r'^admin/', include(admin.site.urls)),
	#url(r'^acc/signup', views.upload),
)
