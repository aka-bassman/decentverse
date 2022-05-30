#어떤 이미지로부터 새로운 이미지를 생성할지를 지정
FROM node:16

#Dockerfile 을 생성/관리하는 사람
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
# /app 디렉토리 생성
RUN mkdir -p /backend
# /app 디렉토리를 WORKDIR 로 설정
WORKDIR /backend
# 현재 Dockerfile 있는 경로의 모든 파일을 /app 에 복사
ADD . /backend

RUN npm i --production

#가상 머신에 오픈할 포트
# EXPOSE 8080 8080

#컨테이너에서 실행될 명령을 지정
CMD ["node", "main.js", "--max-old-space-size=8192"]