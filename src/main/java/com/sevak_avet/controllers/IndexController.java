package com.sevak_avet.controllers;

import com.sevak_avet.domain.Image;
import com.google.gson.Gson;
import com.sevak_avet.fetcher.InstagramFetcher;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by Avetisyan Sevak
 * Date: 15.05.2015
 * Time: 11:25
 */
@Controller
public class IndexController {
    private static Logger log = Logger.getLogger(IndexController.class.getName());

    @Autowired
    private InstagramFetcher<Image> fetcher;

    @RequestMapping(value = "/getImagesByTags", method = GET)
    @ResponseBody
    public String getImages (@RequestParam("tags") String tagsString,
                                  @RequestParam("dateTimeFrom") String from,
                                  @RequestParam("dateTimeTo") String to
    ){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a");
        LocalDateTime fromDate = from==""? null: LocalDateTime.parse(from, formatter);
        LocalDateTime toDate = to==""? null: LocalDateTime.parse(to, formatter);
        Set<Image> images = fetcher.fetchByTags(fromDate, toDate, tagsString);
        Gson gson = new Gson();
        return gson.toJson(images);
    }


}
