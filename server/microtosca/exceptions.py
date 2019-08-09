
class MicroToscaException(Exception):
    pass


class MicroToscaModelNotFoundException(MicroToscaException):
    pass


class NodeTypeDoesNotExistsException(MicroToscaException):
    pass
