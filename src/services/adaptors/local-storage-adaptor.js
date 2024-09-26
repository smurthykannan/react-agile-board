import _ from 'lodash';

const getCollection = (url) => {
  return url.replace(/\//g, "_");
};

class LocalStorageAdaptor {

  get(url, params = {}) {
    const collection = getCollection(url);
    const data = localStorage.getItem(collection);
    const items = data ? JSON.parse(data) : [];

    // If an `id` is provided in `params`, return a single task or `null`
    if (params.id) {
        const task = items.find(item => item.id === params.id);
        return task || null;
    }

    // If `sortBy` is provided in `params`, sort the tasks
    if (params.sortBy) {
        return _.sortBy(items, params.sortBy);
    }

    return items;
}

  post(url, payload) {
    const collection = getCollection(url);
    const data = localStorage.getItem(collection);
    const items = data ? JSON.parse(data) : [];
    if (items.filter((p) => p.id === payload.id).length) {
      throw new Error("Item already exist");
    }

    items.push(payload);
    localStorage.setItem(collection, JSON.stringify(items));
  }

  put(url, payload) {
    const collection = getCollection(url);
    const data = localStorage.getItem(collection);
    const items = data ? JSON.parse(data) : [];
    
    // Find the index of the item to be updated
    const index = items.findIndex((p) => p.id === payload.id);
    
    if (index === -1) {
        throw new Error("Item not found"); 
    }

    // Update the item at the found index
    items[index] = { ...items[index], ...payload };

   
    localStorage.setItem(collection, JSON.stringify(items));
  }


  delete(url, id) {
    
    const collection = getCollection(url);
    const data = localStorage.getItem(collection);
    const items = data ? JSON.parse(data) : [];
    
    // Find the index of the item to be deleted
    const index = items.findIndex((p) => p.id === id);
    
    if (index === -1) {
        throw new Error("Item not found");
    }

    // Remove the item at the found index
    items.splice(index, 1);

    
    localStorage.setItem(collection, JSON.stringify(items));
  }

}

export default LocalStorageAdaptor;
