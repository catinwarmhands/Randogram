package com.sevak_avet.fetcher;

import com.sevak_avet.domain.Image;
import org.jinstagram.Instagram;
import org.jinstagram.entity.common.Pagination;
import org.jinstagram.entity.tags.TagMediaFeed;
import org.jinstagram.exceptions.InstagramException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Created by savetisyan on 14/01/16
 */
@Component
public class InstagramFetcherImpl implements InstagramFetcher<Image> {

    @Autowired
    private Instagram instagram;

    public HashMap <String, Set <Image>> fetchByTag(String tag, String minTagId) {
        HashMap <String, Set <Image>> imageUrls = new HashMap<>();

        TagMediaFeed feed;
        try {
            feed = instagram.getRecentMediaTags(tag);
        } catch (InstagramException e) {
            throw new RuntimeException(e);
        }

       // imageUrls.put(minTagId, feed.getData().stream().map(Image::new).collect(Collectors.toSet()));
        Pagination pagination = feed.getPagination();

        if (pagination.getNextMinId() != null) {
            try {
                feed = instagram.getRecentMediaTags(tag, minTagId, pagination.getNextMinId());
            } catch (InstagramException e) {
                throw new RuntimeException(e);
            }
            pagination = feed.getPagination();
            imageUrls.put(pagination.getNextMinId(),feed.getData().stream().map(Image::new).collect(Collectors.toSet()));
        }

        return imageUrls;
    }

//    private Set<Image> fetchByTag(LocalDateTime fromDate, LocalDateTime toDate, String tag, String minTagId) {
//        return fetchByTag(tag, minTagId)
//                .stream()
//                .filter(x -> x.getDate().isAfter(fromDate) && x.getDate().isBefore(toDate))
//                .collect(Collectors.toSet());
//    }

//    @Override
//    public Set<Image> fetchByTags(LocalDateTime fromDate, LocalDateTime toDate, String... tags) throws InstagramException {
//        return Arrays.stream(tags)
//                .map(tag -> fetchByTag(fromDate, toDate, tag,  null))
//                .flatMap(Collection::stream)
//                .collect(Collectors.toSet());
//    }

    @Override
    public String getEmbeddedHtml(String url) {
        return null;
    }

    @Override
    public String chooseLucky(LocalDateTime fromDate, LocalDateTime toDate, String... tags) {
        return null;
    }
}