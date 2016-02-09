package com.sevak_avet.controllers;

import java.util.ArrayList;
import java.util.Arrays;

/**
 * Created by Avetisyan Sevak
 * Date: 15.05.2015
 * Time: 11:25
 */

public class StringHelper{
    public static ArrayList<String> splitTags(String tagsString){
        tagsString = tagsString.replace("#", "").replace(" ", "");//remove "#" and " "
        String[] tags = tagsString.split(",");
        ArrayList<String> tagsArray = new ArrayList<>(Arrays.asList(tags));
        return tagsArray;
    }
}
