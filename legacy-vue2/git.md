```ts

 git config --global user.name xxx

 git config --global user.email xxx@qq.com
 git config --list
//  初始化仓库  就是在文件夹里面加了一个.git的文件夹
 git init
//  将工作区文件上传至暂存区
  git add index.ts
  //上传版本库
  git commit -m "v1 index初始化"

  git log

  git reflog

  git reset --hard []

  git revert []

  //查看分支
  git branch
  //新建分支
  git branch [name]

  git checkout [name]

  git merge

  git push origin [branch]

  git remote add origin git@github.com:tearlighting/myblogSever.git

```

```ts
# 从上到下执行

# 忽略所md
*.md

# 不忽略git.md
!git.md
```

```ts
 ssh-keygen -t rsa -C xxx@qq.com
 ssh -T git@github.com
 git config --global https.proxy XXX


```

```ts
//上传
git push origin main
git push origin [branch]

```
