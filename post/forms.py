# -*- coding: utf-8 -*-

from django import forms


class DocumentForm(forms.Form):
    image = forms.FileField(label='Select a file', required=False)
    video = forms.FileField(label='Select a file', required=False)
    comment = forms.CharField(widget= forms.Textarea, label='Your comment here', max_length=1000, required=True)
