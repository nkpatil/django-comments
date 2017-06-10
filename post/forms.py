# -*- coding: utf-8 -*-

from django import forms


class DocumentForm(forms.Form):
    docfile = forms.FileField(
        label='Select a file'
    )
    comment = forms.CharField(label='Your comment here', max_length=500)
