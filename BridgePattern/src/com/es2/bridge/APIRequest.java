package com.es2.bridge;

import java.util.HashMap;

public class APIRequest extends Object {
    protected HashMap<String, APIServiceInterface> services;

    public APIRequest(){
        this.services = new HashMap<>();
    }

    public String addService(APIServiceInterface service){
        if(service == null) return null;

        String serviceId = String.valueOf(this.services.size() + 1);
        this.services.put(serviceId, service);

        return serviceId;
    }

    public String getContent(String serviceId, String contentId) throws ServiceNotFoundException{
        APIServiceInterface service = this.services.get(serviceId);

        if(service == null){
            throw new ServiceNotFoundException("Service not found: " + serviceId);
        }

        return service.getContent(contentId);
    }

    public String setContent(String serviceId, String content) throws ServiceNotFoundException{
        APIServiceInterface service = this.services.get(serviceId);

        if(service == null){
            throw new ServiceNotFoundException("Service not found: " + serviceId);
        }

        return service.setContent(content);
    }
}
