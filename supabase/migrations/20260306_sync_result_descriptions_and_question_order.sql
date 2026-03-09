insert into intro_content (key, value)
values ('questionHint', '"되고 싶은 여행자"를 기준으로 골라주세요 ✈️')
on conflict (key) do nothing;

insert into intro_content (key, value)
values
  ('questionPrevBtn', '← 이전'),
  ('questionNextBtn', '다음 →'),
  ('questionResultBtn', '결과 보기 ✈️'),
  ('adsEnabled', 'false')
on conflict (key) do nothing;

update result_types
set description = trim(description) || E'\n\n' || $$공항에 들어서는 순간부터 당신 머릿속에는 동선, 체크인 시간, 수하물 회수 포인트가 한 장의 지도처럼 펼쳐집니다. 일행이 "우리 그냥 감으로 움직일까?"라고 말하는 순간, 이미 당신은 백업 플랜 B와 C까지 준비해둔 상태라 여행 전체가 이상하게도 더 편안해집니다.$$ 
where mbti_code = 'ISTJ'
  and position($$공항에 들어서는 순간부터 당신 머릿속에는 동선, 체크인 시간, 수하물 회수 포인트가 한 장의 지도처럼 펼쳐집니다. 일행이 "우리 그냥 감으로 움직일까?"라고 말하는 순간, 이미 당신은 백업 플랜 B와 C까지 준비해둔 상태라 여행 전체가 이상하게도 더 편안해집니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$여행지에서 누가 목마르다 하면 물이 나오고, 누가 발 아프다 하면 밴드가 나오고, 누가 배고프다 하면 가방 구석에서 간식이 나오는 타입입니다. 결국 모두가 "이번 여행 왜 이렇게 안정적이지?"라고 느끼게 되는 이유가 바로 당신의 조용한 케어력입니다.$$ 
where mbti_code = 'ISFJ'
  and position($$여행지에서 누가 목마르다 하면 물이 나오고, 누가 발 아프다 하면 밴드가 나오고, 누가 배고프다 하면 가방 구석에서 간식이 나오는 타입입니다. 결국 모두가 "이번 여행 왜 이렇게 안정적이지?"라고 느끼게 되는 이유가 바로 당신의 조용한 케어력입니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신이 꿈꾸는 여행은 명소를 많이 찍는 여행보다, 한 장면을 오래 기억하는 여행에 가깝습니다. 골목 끝 카페의 음악, 해 질 무렵의 공기, 괜히 마음에 남는 표정 같은 것들이 쌓이면서 여행이 끝난 뒤에는 후기가 아니라 거의 한 편의 짧은 에세이가 완성됩니다.$$ 
where mbti_code = 'INFJ'
  and position($$당신이 꿈꾸는 여행은 명소를 많이 찍는 여행보다, 한 장면을 오래 기억하는 여행에 가깝습니다. 골목 끝 카페의 음악, 해 질 무렵의 공기, 괜히 마음에 남는 표정 같은 것들이 쌓이면서 여행이 끝난 뒤에는 후기가 아니라 거의 한 편의 짧은 에세이가 완성됩니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신은 여행을 즉흥적 탈출이 아니라, 완성도 높은 기획물처럼 다루고 싶어 합니다. 항공권 타이밍, 예산 분배, 현지 이동 루트, 사진 포인트까지 모두 계산해둔 덕분에 남들은 "어떻게 이렇게 딱 맞아떨어져?"라고 놀라고, 당신은 속으로만 살짝 만족해합니다.$$ 
where mbti_code = 'INTJ'
  and position($$당신은 여행을 즉흥적 탈출이 아니라, 완성도 높은 기획물처럼 다루고 싶어 합니다. 항공권 타이밍, 예산 분배, 현지 이동 루트, 사진 포인트까지 모두 계산해둔 덕분에 남들은 "어떻게 이렇게 딱 맞아떨어져?"라고 놀라고, 당신은 속으로만 살짝 만족해합니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$예상치 못한 변수 하나쯤은 오히려 여행의 난이도를 올려주는 이벤트라고 느끼는 타입입니다. 숙소 예약 꼬임, 렌트카 이슈, 우천 취소 같은 상황에서도 표정 하나 안 바뀌고 해결책을 뽑아내기 때문에, 결국 일행은 당신을 여행 멤버가 아니라 비상 대응 시스템처럼 믿게 됩니다.$$ 
where mbti_code = 'ISTP'
  and position($$예상치 못한 변수 하나쯤은 오히려 여행의 난이도를 올려주는 이벤트라고 느끼는 타입입니다. 숙소 예약 꼬임, 렌트카 이슈, 우천 취소 같은 상황에서도 표정 하나 안 바뀌고 해결책을 뽑아내기 때문에, 결국 일행은 당신을 여행 멤버가 아니라 비상 대응 시스템처럼 믿게 됩니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신이 그리고 있는 여행은 계획표보다 감정선이 더 중요한 여행입니다. 예쁜 골목 하나, 빛이 좋은 창가 자리 하나, 우연히 발견한 소품샵 하나만으로도 하루가 완성되고, 그렇게 모인 장면들은 나중에 사진보다 더 강한 분위기로 기억 속에 남습니다.$$ 
where mbti_code = 'ISFP'
  and position($$당신이 그리고 있는 여행은 계획표보다 감정선이 더 중요한 여행입니다. 예쁜 골목 하나, 빛이 좋은 창가 자리 하나, 우연히 발견한 소품샵 하나만으로도 하루가 완성되고, 그렇게 모인 장면들은 나중에 사진보다 더 강한 분위기로 기억 속에 남습니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신의 이상적인 여행은 현실을 잠깐 벗어나 다른 세계의 주인공이 되는 시간에 가깝습니다. 길을 잃는 순간조차 "언젠가 이 장면도 서사가 되겠지" 하고 받아들이는 낭만 회로가 켜져 있어서, 남들은 실수라고 부르는 순간도 당신에게는 묘하게 예쁜 장면이 됩니다.$$ 
where mbti_code = 'INFP'
  and position($$당신의 이상적인 여행은 현실을 잠깐 벗어나 다른 세계의 주인공이 되는 시간에 가깝습니다. 길을 잃는 순간조차 "언젠가 이 장면도 서사가 되겠지" 하고 받아들이는 낭만 회로가 켜져 있어서, 남들은 실수라고 부르는 순간도 당신에게는 묘하게 예쁜 장면이 됩니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신은 눈앞의 장소를 그냥 소비하지 않고, 그 안에 숨은 맥락까지 이해하고 싶어 하는 여행자입니다. 건물 하나를 봐도 왜 이런 구조인지, 음식 하나를 먹어도 왜 이런 조합이 되었는지 끝까지 파고들기 때문에, 함께 간 사람들은 어느새 가이드북 대신 당신 설명을 듣고 있게 됩니다.$$ 
where mbti_code = 'INTP'
  and position($$당신은 눈앞의 장소를 그냥 소비하지 않고, 그 안에 숨은 맥락까지 이해하고 싶어 하는 여행자입니다. 건물 하나를 봐도 왜 이런 구조인지, 음식 하나를 먹어도 왜 이런 조합이 되었는지 끝까지 파고들기 때문에, 함께 간 사람들은 어느새 가이드북 대신 당신 설명을 듣고 있게 됩니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신이 바라는 여행은 보는 여행이 아니라 몸으로 부딪히는 여행입니다. 높은 곳에서 뛰어내리고, 처음 보는 현지 액티비티에 망설임 없이 참가하고, 낯선 사람들 사이에서도 바로 분위기를 타는 덕분에 여행 전체가 한 편의 리얼리티 쇼처럼 돌아갑니다.$$ 
where mbti_code = 'ESTP'
  and position($$당신이 바라는 여행은 보는 여행이 아니라 몸으로 부딪히는 여행입니다. 높은 곳에서 뛰어내리고, 처음 보는 현지 액티비티에 망설임 없이 참가하고, 낯선 사람들 사이에서도 바로 분위기를 타는 덕분에 여행 전체가 한 편의 리얼리티 쇼처럼 돌아갑니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신은 여행지의 에너지를 구경하는 사람이 아니라 직접 켜는 사람에 가깝습니다. 좋은 음악이 들리면 몸이 먼저 움직이고, 재미있는 공간을 발견하면 주변 사람들까지 끌어들여 분위기를 만들기 때문에, 결국 당신이 있는 자리가 그 여행의 메인 장면으로 남게 됩니다.$$ 
where mbti_code = 'ESFP'
  and position($$당신은 여행지의 에너지를 구경하는 사람이 아니라 직접 켜는 사람에 가깝습니다. 좋은 음악이 들리면 몸이 먼저 움직이고, 재미있는 공간을 발견하면 주변 사람들까지 끌어들여 분위기를 만들기 때문에, 결국 당신이 있는 자리가 그 여행의 메인 장면으로 남게 됩니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신이 꿈꾸는 여행은 계획표보다 호기심이 더 정확하게 길을 안내하는 여행입니다. "저기 뭐지?"라는 한마디가 하루의 방향을 바꾸고, 그렇게 충동적으로 꺾은 골목 끝에서 가이드북에는 없는 가장 기억에 남는 장소를 발견하는 순간이 반복됩니다.$$ 
where mbti_code = 'ENFP'
  and position($$당신이 꿈꾸는 여행은 계획표보다 호기심이 더 정확하게 길을 안내하는 여행입니다. "저기 뭐지?"라는 한마디가 하루의 방향을 바꾸고, 그렇게 충동적으로 꺾은 골목 끝에서 가이드북에는 없는 가장 기억에 남는 장소를 발견하는 순간이 반복됩니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신은 여행지를 감상하기보다 구조를 읽고 공략 포인트를 찾아내는 쪽에 더 가깝습니다. 교통 시스템의 허점, 할인 코드, 숨은 로컬 루트 같은 걸 누구보다 빠르게 캐치해서, 결국 같은 도시를 가도 남들보다 한 단계 더 영리하게 즐긴다는 인상을 남깁니다.$$ 
where mbti_code = 'ENTP'
  and position($$당신은 여행지를 감상하기보다 구조를 읽고 공략 포인트를 찾아내는 쪽에 더 가깝습니다. 교통 시스템의 허점, 할인 코드, 숨은 로컬 루트 같은 걸 누구보다 빠르게 캐치해서, 결국 같은 도시를 가도 남들보다 한 단계 더 영리하게 즐긴다는 인상을 남깁니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신이 바라는 여행은 자유방임보다 잘 굴러가는 여행입니다. 출발 시간, 집합 장소, 예산 분담, 이동 루트를 명확하게 잡아주기 때문에 처음엔 다들 빡빡하다고 말해도, 막상 여행이 끝나면 가장 사고 없이 많이 본 여행이었다는 결론으로 돌아오게 됩니다.$$ 
where mbti_code = 'ESTJ'
  and position($$당신이 바라는 여행은 자유방임보다 잘 굴러가는 여행입니다. 출발 시간, 집합 장소, 예산 분담, 이동 루트를 명확하게 잡아주기 때문에 처음엔 다들 빡빡하다고 말해도, 막상 여행이 끝나면 가장 사고 없이 많이 본 여행이었다는 결론으로 돌아오게 됩니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신은 여행에서 누가 무엇을 좋아하는지 빠르게 읽고, 모두가 적당히 만족하는 합의점을 만드는 데 강합니다. 누군가 소외되지 않게 챙기고, 식사나 일정도 자연스럽게 조율해서 결국 이 여행의 분위기 전체를 부드럽게 유지시키는 숨은 총괄 역할을 맡게 됩니다.$$ 
where mbti_code = 'ESFJ'
  and position($$당신은 여행에서 누가 무엇을 좋아하는지 빠르게 읽고, 모두가 적당히 만족하는 합의점을 만드는 데 강합니다. 누군가 소외되지 않게 챙기고, 식사나 일정도 자연스럽게 조율해서 결국 이 여행의 분위기 전체를 부드럽게 유지시키는 숨은 총괄 역할을 맡게 됩니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신이 상상하는 여행은 모두의 순간을 조금 더 특별하게 연출하는 여행입니다. 사진 한 장도 그냥 찍지 않고, 지금 이 장면을 어떻게 남기면 가장 빛날지까지 고민하기 때문에, 일행은 당신과 함께 있으면 이상하게 자신도 더 멋진 사람이 된 것 같은 기분을 느끼게 됩니다.$$ 
where mbti_code = 'ENFJ'
  and position($$당신이 상상하는 여행은 모두의 순간을 조금 더 특별하게 연출하는 여행입니다. 사진 한 장도 그냥 찍지 않고, 지금 이 장면을 어떻게 남기면 가장 빛날지까지 고민하기 때문에, 일행은 당신과 함께 있으면 이상하게 자신도 더 멋진 사람이 된 것 같은 기분을 느끼게 됩니다.$$ in description) = 0;

update result_types
set description = trim(description) || E'\n\n' || $$당신은 여행을 "좋았어" 정도로 끝내지 않고, 이번에도 하나를 해냈다는 감각으로 마무리하고 싶어 합니다. 목표를 세우고 체크리스트를 지워나가며, 가장 효율적인 방식으로 가장 많은 것을 경험하려 하기 때문에 당신의 여행은 늘 성취감과 추진력이 강하게 남습니다.$$ 
where mbti_code = 'ENTJ'
  and position($$당신은 여행을 "좋았어" 정도로 끝내지 않고, 이번에도 하나를 해냈다는 감각으로 마무리하고 싶어 합니다. 목표를 세우고 체크리스트를 지워나가며, 가장 효율적인 방식으로 가장 많은 것을 경험하려 하기 때문에 당신의 여행은 늘 성취감과 추진력이 강하게 남습니다.$$ in description) = 0;

do $$
begin
  if (
    select array_agg(axis order by sort_order)
    from questions
    where sort_order between 1 and 12
  ) = array['EI', 'EI', 'EI', 'SN', 'SN', 'SN', 'TF', 'TF', 'TF', 'JP', 'JP', 'JP']::text[] then
    update questions
    set sort_order = case sort_order
      when 4 then 101
      when 12 then 102
      when 1 then 103
      when 2 then 104
      when 5 then 105
      when 6 then 106
      when 8 then 107
      when 3 then 108
      when 7 then 109
      when 9 then 110
      when 11 then 111
      when 10 then 112
    end
    where sort_order between 1 and 12;

    update questions
    set sort_order = sort_order - 100
    where sort_order between 101 and 112;
  end if;
end $$;
