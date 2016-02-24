package com.sevak_avet.controllers;

import com.sevak_avet.domain.Image;
import com.google.gson.Gson;
import com.sevak_avet.fetcher.InstagramFetcher;
import com.sevak_avet.util.TagHelper;
import org.apache.log4j.Logger;
import org.jinstagram.InstagramOembed;
import org.jinstagram.entity.oembed.OembedInformation;
import org.jinstagram.exceptions.InstagramException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class IndexController {
    private static Logger log = Logger.getLogger(IndexController.class.getName());

    @Autowired
    private InstagramFetcher<Image> fetcher;

    @RequestMapping(value = "/getTagAmount", method = RequestMethod.POST)
    @ResponseBody
    public long getTagAmount (@RequestParam("tags") String tagsString) {
        ArrayList<String> tags = TagHelper.splitTags(tagsString);
        return fetcher.getTagAmount(fetcher.getSmallestTag(tags));
    }

    @RequestMapping(value = "/getFirstImages", method = RequestMethod.POST)
    @ResponseBody
    public String getFirstImages (@RequestParam("accesToken") String accesToken,
                                  @RequestParam("tags") String tagsString,
                                  @RequestParam("amount") int amount) {
        ArrayList<String> tags = TagHelper.splitTags(tagsString);
        if(tags.isEmpty()){return null;}

        List<Image> images = fetcher.fetchFirst(accesToken, tags, amount);
        return new Gson().toJson(images);
    }

    @RequestMapping(value = "/getImages", method = RequestMethod.POST)
    @ResponseBody
    public String getImages (@RequestParam("accesToken") String accesToken,
                             @RequestParam("tags") String tagsString,
                             @RequestParam("following") String following,
                             @RequestParam("dateTimeFrom") String from,
                             @RequestParam("dateTimeTo") String to) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a");
        LocalDateTime fromDate = from==""? null: LocalDateTime.parse(from, formatter);
        LocalDateTime toDate = to==""? null: LocalDateTime.parse(to, formatter);

        ArrayList<String> tags = TagHelper.splitTags(tagsString);
        if(tags.isEmpty()){return null;}

        List<Image> images = fetcher.fetchByTags(accesToken, tags, following, fromDate, toDate);
        return new Gson().toJson(images);
    }
}
