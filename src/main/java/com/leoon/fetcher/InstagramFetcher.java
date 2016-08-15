package com.leoon.fetcher;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


public interface InstagramFetcher<T> {
    List<T> fetchByTags(String token, ArrayList<String> tags, String following, LocalDateTime fromDate, LocalDateTime toDate);
    List<T> fetchFirst(String token, ArrayList<String> tags, int amount);
    long getTagAmount(String tag);
    String getSmallestTag(ArrayList<String> tags);
}
