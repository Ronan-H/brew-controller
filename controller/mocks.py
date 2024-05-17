import platform

enabled = 'Linux' not in platform.platform()

async def empty_awaitable():
    pass

class MockMerossDevice:
    def __init__(self):
        self.on = False

    def is_on(self):
        return self.on
    
    def async_turn_on(self, **kwargs):
        self.on = True
        return empty_awaitable()

    def async_turn_off(self, **kwargs):
        self.on = False
        return empty_awaitable()
