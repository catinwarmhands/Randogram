package com.sevak_avet.domain;

import org.jinstagram.entity.common.Images;
import org.jinstagram.entity.users.feed.MediaFeedData;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * Created by savetisyan on 23/01/16
 */
public class Image {
    private String thumbnail;
    private String low;
    private String standard;
    private LocalDateTime date;

    public Image(MediaFeedData x) {
        Images images = x.getImages();
        thumbnail = images.getThumbnail().getImageUrl();
        low = images.getLowResolution().getImageUrl();
        standard = images.getStandardResolution().getImageUrl();

        Instant instant = Instant.ofEpochMilli(Long.parseLong(x.getCreatedTime()) * 1_000L);
        date = LocalDateTime.ofInstant(instant, ZoneOffset.UTC);
    }

    public Image(String thumbnail, String low, String standard) {
        this.thumbnail = thumbnail;
        this.low = low;
        this.standard = standard;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getLow() {
        return low;
    }

    public void setLow(String low) {
        this.low = low;
    }

    public String getStandard() {
        return standard;
    }

    public void setStandard(String standard) {
        this.standard = standard;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Image image = (Image) o;

        if (thumbnail != null ? !thumbnail.equals(image.thumbnail) : image.thumbnail != null) return false;
        if (low != null ? !low.equals(image.low) : image.low != null) return false;
        if (standard != null ? !standard.equals(image.standard) : image.standard != null) return false;
        return date != null ? date.equals(image.date) : image.date == null;

    }

    @Override
    public int hashCode() {
        int result = thumbnail != null ? thumbnail.hashCode() : 0;
        result = 31 * result + (low != null ? low.hashCode() : 0);
        result = 31 * result + (standard != null ? standard.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        return result;
    }
}
