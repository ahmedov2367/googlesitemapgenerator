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


#include "sitemapservice/urlproviderinfo.h"

UrlProviderInfo::UrlProviderInfo() {
  Reset();
}

void UrlProviderInfo::Reset() {
  success_ = false;
  last_update_ = -1;
  urls_count_ = 0;
}

bool UrlProviderInfo::Save(TiXmlElement* element) {
  SaveBoolAttribute(element, "success", success_);
  SaveTimeAttribute(element, "last_update", last_update_);
  SaveAttribute(element, "urls_count", urls_count_);

  return true;  // always success.
}
