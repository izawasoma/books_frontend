import { Heading } from '@chakra-ui/react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  FormControl,
  FormLabel,
  Input,
  Card, 
  CardHeader, 
  CardBody, 
  Button
} from '@chakra-ui/react'
import './App.css'
import React, { useEffect, useState } from 'react'

type Memo = {
  id: number;
  content: string;
  user: string;
  created_at: string;
  updated_at: string;
}

function App() {

  /**
   * メモ情報を保存するステート
   */
  const [memos, setMemos] = useState<Memo[]>([]);

  /**
   * フォーム入力内容を保持する
   */
  const [user, setUser] = useState<string>("");
  const [content, setContent] = useState<string>("");

  /**
   * フォームの値を更新する
   */
  function changeInputUser(event: React.ChangeEvent<HTMLInputElement>):void {
    setUser(event.target.value);
  };
  function changeInputContent(event: React.ChangeEvent<HTMLInputElement>):void {
    setContent(event.target.value);
  };

  /**
   * フォームのボタンをクリックした時の処理
   */
  function clickButton(){
    postMemo(content,user);
  }

  /**
   * 初回接続時
   */
  useEffect(() => {
    getMemos();
  }, []);

  /**
   * API:一覧取得
   */
  async function getMemos() {
    const res = await fetch("http://localhost:80/api/memo")
    let resJson: Memo[] = await res.json();
    resJson = resJson.reverse();
    setMemos(resJson);
  }

  async function postMemo(content:string, user:string){
    const form = new FormData();
    form.append('user', user);
    form.append('content', content);
    const formResponse = await fetch("http://localhost:80/api/memo", {
      method: "POST",
      body: form
    });
    getMemos();
    setContent("");
    setUser("");
    console.log(formResponse);
  }

  /**
   * メモ一覧
   */
  const MemoList = memos.map(memo => {
    return (<>
      <Tr key={memo.id}>
        <Td>{memo.id}</Td>
        <Td>{memo.content}</Td>
        <Td>{memo.user}</Td>
      </Tr>
    </>);
  });

  return (
    <>
      <Heading marginBottom={"2rem"}>メモアプリ</Heading>
      <Card marginBottom={"2rem"}>
        <CardHeader fontWeight={'bold'}>
          登録フォーム
        </CardHeader>
        <hr />
        <CardBody>
          <FormControl>
            <FormLabel>登録者の名前</FormLabel>
            <Input 
            marginBottom={"1rem"} 
            placeholder='山田一郎' 
            onChange={changeInputUser} 
            value={user} />
            <FormLabel>内容</FormLabel>
            <Input 
            marginBottom={"1rem"} 
            placeholder='メモしたい内容をここに記述しましょう。'
            onChange={changeInputContent}
            value={content} />
            <Button 
            colorScheme='teal' 
            size='md'
            onClick={clickButton}>登録</Button>
          </FormControl>
        </CardBody>
      </Card>
      <TableContainer>
        <Table variant='striped' colorScheme='teal'>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>コンテンツ</Th>
              <Th>ユーザー</Th>
            </Tr>
          </Thead>
          <Tbody>
            { MemoList }
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

export default App
