// Copyright 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


#include "sitemapservice/applicationinfo.h"

#include "common/url.h"
#include "sitemapservice/visitingrecord.h"


ApplicationInfo::ApplicationInfo() {
  Reset();
}

void ApplicationInfo::Reset() {
  memory_used_ = 0;
  disk_used_ = 0;
  start_time_ = time(NULL);

  // Reset all sites.
  std::map<std::string, SiteInfo>::iterator itr = site_infos_.begin();
  for (; itr != site_infos_.end(); ++itr) {
    itr->second.Reset();
  }
}

// TODO: caculate disk and memory usage.
void ApplicationInfo::AutomaticUpdate() {
  memory_used_ = 0;
  disk_used_ = 0;

  int64 entry_size = sizeof(UrlFprint) + sizeof(VisitingRecord);
  std::map<std::string, SiteInfo>::iterator itr = site_infos_.begin();
  for (; itr != site_infos_.end(); ++itr) {
    SiteInfo& info = itr->second;
    info.set_memory_used(entry_size * info.url_in_memory());
    info.set_disk_used(entry_size * (info.url_in_database() + info.url_in_tempfile()));

    memory_used_ += info.memory_used();
    disk_used_ += info.disk_used();
  }
}

bool ApplicationInfo::Save(TiXmlElement* element) {
  SaveAttribute(element, "memory_used", memory_used_);
  SaveAttribute(element, "disk_used", disk_used_);
  SaveTimeAttribute(element, "start_time", start_time_);

  bool result = true;
  std::map<std::string, SiteInfo>::iterator itr = site_infos_.begin();
  for (; itr != site_infos_.end() && result; ++itr) {
    TiXmlElement* site_xml = new TiXmlElement("SiteInfo");
    element->LinkEndChild(site_xml);
    result = itr->second.Save(site_xml);
  }
  return result;
}

SiteInfo* ApplicationInfo::site_info(const char* site_id) {
  if (site_infos_.find(site_id) != site_infos_.end()) {
    return &(site_infos_.find(site_id)->second);
  } else {
    return NULL;
  }
}

SiteInfo* ApplicationInfo::AddSiteInfo(const char* site_id) {
  if (site_infos_.find(site_id) == site_infos_.end()) {
    SiteInfo newsite;
    newsite.set_site_id(site_id);
    site_infos_[site_id] = newsite;
  }

  return &(site_infos_.find(site_id)->second);
}

void ApplicationInfo::ClearSites() {
  site_infos_.clear();
}
