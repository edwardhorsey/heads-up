    if not public_key.verify(message.encode("utf8"), decoded_signature):
        print('Signature verification failed')
        return False