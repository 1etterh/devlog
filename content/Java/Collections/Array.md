---
tags:
  - ram
  - java
---
> ==동일한 자료형==을 연속된 메모리 공간에 저장하고 <br/>
> 배열의 주소는 stack 영역에, 데이터는 heap영역에 저장


# 배열의 선언


```Java
int[] arr = new int[5];
```

> 배열의 길이는 최초 선언한 값으로 ==고정된다==.

![[content/JAVA/assets/Array.png]]

- 기본 자료형이 아닌 변수들(참조 자료형)은 모두 stack영역에 4byte 공간을 할당받음
- new 붙은 애들은 모두 Heap영역에 할당
- Heap영역은 빈 공간을 허용하지 않아 자료형의 기본 값으로 초기화된다.


## 다차원 배열
> 2차원 이상의 배열을 다차원 배열이라고 한다.<br/>
> 다차원 배열의 일부 인덱스는 또 다른 배열의 주소를 보관하는 배열 역할을 한다.

- 정변 배열: 길이가 고정된 배열
- 가변 배열: 길이가 고정되지 않은 배열
![[content/JAVA/assets/2dArray_0.png]]
### 배열 레퍼런스 변수
> stack영역에 존재(4byte)하며 heap영역에 있는 데이터의 주소를 저장

```Java
int[][] iArr = new int[3][4];
System.out.println("iArr" + iArr); // [I@4f023edb
```

![[content/JAVA/assets/2dArray_1.png]]

# 배열의 복사
> 배열의 복사에는 DeepCopy와 Shallow Copy가 있다.

1. 얕은 복사(shallow copy): stack의 주소값만 복사하여 원본을 공유한다.
2. 깊은 복사(deep copy): heap의 배열에 저장된 값을 복사, 원본과 사본을 분리하여 관리한다.

##### Shallow Copy

![[content/JAVA/assets/shallow_copy.png]]

##### Deep Copy

![[content/JAVA/assets/deep_copy.png]]

> deep copy를 하는 방법은 4가지가 있다.

1. for문을 이용한 동일 인덱스값  복사
2. Object와 clone()을 이용한 복사(사용 빈도 높음)
3. System.arrayCopy()를 이용한 복사
4. Arrays.copyOf()을 이용한 복사

```Java
  
    int[] originArr = new int[]{1,2,3,4};  
    printArr(originArr,"원본");  
	/*
	========== 원본 ==========
	넘어온 배열의 hashCode: 1528902577
	Arrays.toString(arr) = [1, 2, 3, 4]
	*/
  
    /* 목차 1. for문 활용 */  
    int[] copyArr1 = new int[originArr.length];     // new: heap에 새로운 공간을 만들겠다는 뜻(주소 다름)  
    for (int i = 0; i < copyArr1.length; i++) {  
        copyArr1[i] = originArr[i];  
    }  
    printArr(copyArr1, "for문을 활용한 사본");  

	/*
	========== for문을 활용한 사본 ==========
	넘어온 배열의 hashCode: 834600351
	Arrays.toString(arr) = [1, 2, 3, 4]
	*/
    
    /* 목차 2. clone()을 활용 */  
    int[] copyArr2 = originArr.clone();             // 모든 배열은 clone() 사용하여 heap에 새로운 공간 할당 가능  
    printArr(copyArr2, "clone()을 활용한 사본");  
	/*
	========== clone()을 활용한 사본 ==========
	넘어온 배열의 hashCode: 471910020
	Arrays.toString(arr) = [1, 2, 3, 4]
	*/
	
    /* 목차 3. arrayCopy()를 이용한 복사 */  
    int[] copyArr3 = new int[originArr.length+3]; // 원본보다 3 큰 배열  
    System.arraycopy(originArr, 0, copyArr3,3,3);  
    printArr(copyArr3, "arrayCopy()를 활용한 사본");  
	/*
	========== arrayCopy()를 활용한 사본 ==========
	넘어온 배열의 hashCode: 531885035
	Arrays.toString(arr) = [0, 0, 0, 1, 2, 3, 0]
	*/


    /* 목차 4. copyOf()를 이용한 복사(원본의 처음부터만 가능) */  
    int[] copyArr4 = Arrays.copyOf(originArr, 2); // 0번부터 2개만 자름  
    printArr(copyArr4, "copyOf()를 활용한 사본");  
	/*
	========== copyOf()를 활용한 사본 ==========
	넘어온 배열의 hashCode: 1418481495
	Arrays.toString(arr) = [1, 2]
	*/

```