package com.sevak_avet.fetcher;

import com.sevak_avet.domain.Image;
import org.jinstagram.Instagram;
import org.jinstagram.entity.common.Pagination;
import org.jinstagram.entity.tags.TagMediaFeed;
import org.jinstagram.exceptions.InstagramException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Created by savetisyan on 14/01/16
 */
@Component
public class InstagramFetcherImpl implements InstagramFetcher<Image> {

    @Autowired
    private Instagram instagram;

    private Set<Image> fetchByTag(String tag) {
        TagMediaFeed feed;
        try {
            feed = instagram.getRecentMediaTags(tag);
        } catch (InstagramException e) {
            throw new RuntimeException(e);
        }

        Set<Image> imageUrls = feed.getData().stream().map(Image::new).collect(Collectors.toSet());
        Pagination pagination = feed.getPagination();

        while (pagination.getNextMaxTagId() != null) {
            try {
                feed = instagram.getRecentMediaTags(tag, null, pagination.getNextMaxTagId());
            } catch (InstagramException e) {
                throw new RuntimeException(e);
            }

            imageUrls.addAll(feed.getData().stream().map(Image::new).collect(Collectors.toSet()));
            pagination = feed.getPagination();
        }

        return imageUrls;
    }

    private Set<Image> fetchByTag(LocalDateTime fromDate, LocalDateTime toDate, String tag) {
        return fetchByTag(tag)
                .stream()
                .filter(x -> x.getDate().isAfter(fromDate) && x.getDate().isBefore(toDate))
                .collect(Collectors.toSet());
    }

    @Override
    public Set<Image> fetchByTags(LocalDateTime fromDate, LocalDateTime toDate, String... tags) throws InstagramException {
        return Arrays.stream(tags)
                .map(tag -> fetchByTag(fromDate, toDate, tag))
                .flatMap(Collection::stream)
                .collect(Collectors.toSet());
    }

    @Override
    public String getEmbeddedHtml(String url) {
        return null;
    }

    @Override
    public String chooseLucky(LocalDateTime fromDate, LocalDateTime toDate, String... tags) {
        return null;
    }
}