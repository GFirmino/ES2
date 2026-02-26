package com.es2.bridge;

import java.util.LinkedHashMap;

public class APIMoodle extends Object implements APIServiceInterface {
    protected LinkedHashMap<String, String> content;

    public APIMoodle(){
        this.content = new LinkedHashMap<>();
    }

    @Override
    public String getContent(String contentId) {
        if(contentId == null) return null;

        if("0".equals(contentId)){
            if(content.isEmpty()) return "";

            StringBuilder sb = new StringBuilder();
            for(String value : content.values()){
                sb.append(value);
            }
            return sb.toString();
        }
        return this.content.get(contentId);
    }

    @Override
    public String setContent(String content) {
        if(content == null) return null;

        String contentId = String.valueOf(this.content.size() + 1);
        this.content.put(contentId, content);

        return contentId;
    }
}
