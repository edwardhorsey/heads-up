import uuid 

a = uuid.uuid1()

collection = {}


collection[a] = 'secret code'

b = str(a)

print(collection[a])
print(collection[uuid.UUID(b)])