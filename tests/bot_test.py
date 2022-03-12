# -*- coding: utf-8 -*-
import pytest
from ai_tts_donations.bot import request_tts


@pytest.mark.parametrize("test_input", [
    'spongebob: test',
    'spongebob: test || drake: test',
    'spongebob: test || (1) || drake: test || (2) || kanye-west-rap: test || drake: test',
    '(1) || (2) || (3)',
    '(1)'
])
def test_requesting_tts(test_input):
    request_tts(test_input)
