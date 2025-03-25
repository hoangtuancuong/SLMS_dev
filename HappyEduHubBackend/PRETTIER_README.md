# Cách setup git hooks cho prettier

1. Cài đặt prettier

```sh
npm install --save-dev --save-exact prettier
```

2. Đảm bảo đã có sh trong path (không biết thì hỏi ChatGPT)

3. Tạo file git hook

- B1: Đến thư mục `.git/hooks`
- B2: Tạo file `pre-commit` (không có extension)
- B3: Thêm đoạn code sau vào file `pre-commit`

```sh
#!/bin/sh
FILES=$(git diff --cached --name-only --diff-filter=ACMR | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0

# Prettify all selected files
echo "$FILES" | xargs ./node_modules/.bin/prettier --ignore-unknown --write

# Add back the modified/prettified files to staging
echo "$FILES" | xargs git add

exit 0
```

- B4: Tạo file `post-commit` (không có extension)
- B5: Thêm đoạn code sau vào file `post-commit`

```sh
#!/bin/sh
git update-index -g
```
